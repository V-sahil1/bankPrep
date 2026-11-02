import "server-only";
import { ApiError, FinishReason, GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { AppError } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { NEAR_DUPLICATE_THRESHOLD, questionHash, textSimilarity } from "@/lib/question-hash";
import { aiGeneratedSetSchema, aiQuestionSchema } from "@/validations/question";
import type { Difficulty } from "@prisma/client";

const DEFAULT_MODEL = "gemini-2.5-flash";

export function isAIConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export type GenerationContext = {
  examName: string;
  subjectName: string;
  topicName: string;
  difficulty: Difficulty;
  count: number;
  avoid: string[];
};

const SYSTEM_PROMPT = `You write original practice questions for Indian banking recruitment exams (IBPS, SBI, RBI).

Each question has exactly four distinct options, one correct answer, and an explanation that shows the working or reasoning and says why the most tempting wrong option is wrong.

Match the difficulty and style of the named exam. Calculate every numerical answer and check that exactly one option is correct before you include a question. Prefer facts that do not go stale; if a fact depends on time, put the date in the question.

These are practice questions, so never say or imply that a question appeared in a past paper, and never name a year, shift or paper as its source.`;

export function buildUserPrompt(ctx: GenerationContext): string {
  const avoid = ctx.avoid.length
    ? `\n\nThese questions already exist for this topic, so do not repeat or lightly reword them:\n${ctx.avoid.map((q) => `- ${q}`).join("\n")}`
    : "";
  return `Write ${ctx.count} ${ctx.difficulty.toLowerCase()} questions.\n\nExam: ${ctx.examName}\nSubject: ${ctx.subjectName}\nTopic: ${ctx.topicName}${avoid}`;
}

/** The raw generation call. Injected in tests so they never touch the network. */
export type GenerateFn = (ctx: GenerationContext) => Promise<{ raw: unknown[]; model: string }>;

function responseSchema() {
  const schema = z.toJSONSchema(aiGeneratedSetSchema);
  delete schema.$schema;
  return schema;
}

export const callGemini: GenerateFn = async (ctx) => {
  // The key is read here, on the server, and never leaves this module.
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = process.env.AI_MODEL?.trim() || DEFAULT_MODEL;

  const response = await client.models.generateContent({
    model,
    contents: buildUserPrompt(ctx),
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseJsonSchema: responseSchema(),
      maxOutputTokens: 60000,
    },
  });

  // Check why generation stopped before trusting the text.
  const finishReason = response.candidates?.[0]?.finishReason;
  if (finishReason === FinishReason.MAX_TOKENS) {
    throw new AppError("The AI response was cut off. Request fewer questions.");
  }
  if (response.promptFeedback?.blockReason || (finishReason && finishReason !== FinishReason.STOP)) {
    throw new AppError("The AI model declined this request. Try a different topic or wording.");
  }

  const parsed = aiGeneratedSetSchema.safeParse(JSON.parse(response.text ?? ""));
  if (!parsed.success) throw new AppError("The AI response was not in the expected format.");
  return { raw: parsed.data.questions, model };
};

export type FilteredGeneration = {
  accepted: ReturnType<typeof aiQuestionSchema.parse>[];
  invalid: number;
  duplicates: number;
};

/** Validates generated questions and drops duplicates of the bank and of each other. */
export function filterGenerated(raw: unknown[], existingTexts: string[]): FilteredGeneration {
  const accepted: FilteredGeneration["accepted"] = [];
  const known = [...existingTexts];
  const knownHashes = new Set(existingTexts.map((text) => questionHash(text)));
  let invalid = 0;
  let duplicates = 0;

  for (const item of raw) {
    const result = aiQuestionSchema.safeParse(item);
    if (!result.success) {
      invalid += 1;
      continue;
    }
    const text = result.data.questionText;
    const isDuplicate =
      knownHashes.has(questionHash(text)) || known.some((other) => textSimilarity(text, other) >= NEAR_DUPLICATE_THRESHOLD);
    if (isDuplicate) {
      duplicates += 1;
      continue;
    }
    accepted.push(result.data);
    known.push(text);
    knownHashes.add(questionHash(text));
  }
  return { accepted, invalid, duplicates };
}

function describeError(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof ApiError) {
    if (error.status === 400 || error.status === 401 || error.status === 403) {
      return "Gemini rejected the request. Check GEMINI_API_KEY and that your key can use this model.";
    }
    if (error.status === 404) return "That Gemini model is not available to your key. Change AI_MODEL in .env.";
    if (error.status === 429) return "Gemini is rate limiting requests, or your quota is used up. Try again shortly.";
    return `Gemini returned an error (${error.status}).`;
  }
  if (error instanceof SyntaxError) return "The AI response was not valid JSON.";
  return "Question generation failed. Check the server's connection and try again.";
}

export type GenerationRequest = {
  examId: string;
  subjectId: string;
  topicId: string;
  difficulty: Difficulty;
  count: number;
};

/**
 * Runs one generation job and stores what survives as PENDING_REVIEW. Generated
 * questions never reach learners until an admin approves them.
 */
export async function runGenerationJob(adminId: string, request: GenerationRequest, generate: GenerateFn = callGemini) {
  if (generate === callGemini && !isAIConfigured()) {
    throw new AppError("AI generation is not configured. Set GEMINI_API_KEY on the server.");
  }

  const topic = await prisma.topic.findFirst({
    where: { id: request.topicId, subjectId: request.subjectId },
    select: { name: true, subject: { select: { name: true } } },
  });
  const exam = await prisma.exam.findUnique({ where: { id: request.examId }, select: { name: true } });
  if (!topic || !exam) throw new AppError("That exam, subject or topic no longer exists.");

  const job = await prisma.aIQuestionGenerationJob.create({
    data: {
      createdById: adminId,
      examId: request.examId,
      subjectId: request.subjectId,
      topicId: request.topicId,
      difficulty: request.difficulty,
      requestedCount: request.count,
      status: "RUNNING",
    },
  });

  try {
    const existing = await prisma.question.findMany({
      where: { topicId: request.topicId },
      select: { questionText: true },
    });
    const existingTexts = existing.map((q) => q.questionText);

    const { raw, model } = await generate({
      examName: exam.name,
      subjectName: topic.subject.name,
      topicName: topic.name,
      difficulty: request.difficulty,
      count: request.count,
      avoid: existingTexts.slice(0, 40),
    });

    const { accepted, invalid, duplicates } = filterGenerated(raw, existingTexts);

    await prisma.$transaction(async (tx) => {
      for (const q of accepted) {
        await tx.question.create({
          data: {
            examId: request.examId,
            subjectId: request.subjectId,
            topicId: request.topicId,
            aiJobId: job.id,
            questionText: q.questionText,
            explanation: q.explanation,
            difficulty: request.difficulty,
            format: "MCQ",
            sourceType: "AI_GENERATED",
            sourceReference: `Generated by ${model}`,
            tags: q.tags,
            status: "PENDING_REVIEW",
            contentHash: questionHash(q.questionText),
            options: {
              create: q.options.map((text, order) => ({ text, order, isCorrect: order === q.correctIndex })),
            },
            relevantExams: { create: [{ examId: request.examId }] },
          },
        });
      }
      await tx.aIQuestionGenerationJob.update({
        where: { id: job.id },
        data: {
          status: "COMPLETED",
          model,
          generatedCount: accepted.length,
          duplicateCount: duplicates,
          invalidCount: invalid,
          completedAt: new Date(),
        },
      });
    });

    return { jobId: job.id, generated: accepted.length, duplicates, invalid };
  } catch (error) {
    const message = describeError(error);
    await prisma.aIQuestionGenerationJob.update({
      where: { id: job.id },
      data: { status: "FAILED", error: message, completedAt: new Date() },
    });
    if (!(error instanceof AppError) && !(error instanceof ApiError)) console.error(error);
    throw new AppError(message);
  }
}
