"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AppError, runAction } from "@/lib/actions";
import { requireAdmin } from "@/lib/session";
import { isAIConfigured, runGenerationJob } from "@/services/ai-generation";
import * as catalog from "@/services/catalog-admin";
import * as bank from "@/services/question-bank";
import {
  contextSchema,
  examSchema,
  mockTestSchema,
  nameSchema,
  parseTableText,
  patternSchema,
} from "@/validations/admin";
import { aiGenerationRequestSchema, difficultySchema } from "@/validations/question";

// Every action here checks the admin role itself. Hiding the UI is not access control.

const id = z.string().min(1);

function refresh() {
  revalidatePath("/", "layout");
}

export async function saveExamAction(examId: unknown, input: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.saveExam(id.nullable().parse(examId), examSchema.parse(input));
    refresh();
  });
}

export async function setExamActiveAction(examId: unknown, active: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.setExamActive(id.parse(examId), z.boolean().parse(active));
    refresh();
  });
}

export async function deleteExamAction(examId: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.deleteExam(id.parse(examId));
    refresh();
  });
}

export async function saveSubjectAction(subjectId: unknown, input: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.saveSubject(id.nullable().parse(subjectId), nameSchema.parse(input).name);
    refresh();
  });
}

export async function deleteSubjectAction(subjectId: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.deleteSubject(id.parse(subjectId));
    refresh();
  });
}

export async function saveTopicAction(topicId: unknown, subjectId: unknown, input: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.saveTopic(id.nullable().parse(topicId), id.parse(subjectId), nameSchema.parse(input).name);
    refresh();
  });
}

export async function deleteTopicAction(topicId: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.deleteTopic(id.parse(topicId));
    refresh();
  });
}

export async function moveTopicAction(topicId: unknown, direction: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.moveTopic(id.parse(topicId), z.enum(["up", "down"]).parse(direction));
    refresh();
  });
}

export async function setExamSubjectAction(examId: unknown, subjectId: unknown, enabled: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.setExamSubject(id.parse(examId), id.parse(subjectId), z.boolean().parse(enabled));
    refresh();
  });
}

export async function setExamTopicAction(examId: unknown, topicId: unknown, enabled: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.setExamTopic(id.parse(examId), id.parse(topicId), z.boolean().parse(enabled));
    refresh();
  });
}

export async function savePatternAction(patternId: unknown, input: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.savePattern(id.nullable().parse(patternId), patternSchema.parse(input));
    refresh();
  });
}

export async function setPatternVerifiedAction(patternId: unknown, verified: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.setPatternVerified(id.parse(patternId), z.boolean().parse(verified));
    refresh();
  });
}

export async function createMockTestAction(input: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.createMockTest(mockTestSchema.parse(input));
    refresh();
  });
}

export async function setMockActiveAction(mockId: unknown, active: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.setMockActive(id.parse(mockId), z.boolean().parse(active));
    refresh();
  });
}

export async function deleteMockTestAction(mockId: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.deleteMockTest(id.parse(mockId));
    refresh();
  });
}

export async function saveContextAction(contextId: unknown, input: unknown) {
  return runAction(async () => {
    await requireAdmin();
    const { tableText, ...data } = contextSchema.parse(input);
    let table: ReturnType<typeof parseTableText>;
    try {
      table = parseTableText(tableText);
    } catch (error) {
      throw new AppError((error as Error).message);
    }
    await catalog.saveContext(id.nullable().parse(contextId), { ...data, table });
    refresh();
  });
}

export async function deleteContextAction(contextId: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.deleteContext(id.parse(contextId));
    refresh();
  });
}

export async function saveQuestionAction(questionId: unknown, input: unknown) {
  return runAction(async () => {
    await requireAdmin();
    const saved = await bank.saveQuestion(id.nullable().parse(questionId), input);
    refresh();
    return saved;
  });
}

export async function deleteQuestionAction(questionId: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await bank.deleteQuestion(id.parse(questionId));
    refresh();
  });
}

export async function setDifficultyAction(questionId: unknown, difficulty: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await bank.setQuestionDifficulty(id.parse(questionId), difficultySchema.parse(difficulty));
    refresh();
  });
}

export async function validateImportAction(rows: unknown) {
  return runAction(async () => {
    await requireAdmin();
    const { results } = await bank.validateImport(bank.importRowsSchema.parse(rows));
    return results;
  });
}

export async function commitImportAction(rows: unknown) {
  return runAction(async () => {
    await requireAdmin();
    const created = await bank.commitImport(bank.importRowsSchema.parse(rows));
    refresh();
    return created;
  });
}

export async function generateQuestionsAction(input: unknown) {
  return runAction(async () => {
    const admin = await requireAdmin();
    if (!isAIConfigured()) throw new AppError("AI generation is not configured. Set GEMINI_API_KEY on the server.");
    const result = await runGenerationJob(admin.id, aiGenerationRequestSchema.parse(input));
    refresh();
    return result;
  });
}

export async function reviewQuestionsAction(input: unknown) {
  return runAction(async () => {
    await requireAdmin();
    const { ids, decision, reason } = z
      .object({
        ids: z.array(id).min(1, "Select at least one question."),
        decision: z.enum(["APPROVED", "REJECTED"]),
        reason: z.string().trim().max(500).optional(),
      })
      .parse(input);
    const count = await bank.reviewQuestions(ids, decision, reason);
    refresh();
    return count;
  });
}

export async function verifyPyqAction(input: unknown) {
  return runAction(async () => {
    const admin = await requireAdmin();
    const { questionId, sourceReference, verified } = z
      .object({ questionId: id, sourceReference: z.string().max(500), verified: z.boolean() })
      .parse(input);
    await bank.verifyPyq(admin.id, questionId, sourceReference, verified);
    refresh();
  });
}

export async function resolveReportAction(reportId: unknown, status: unknown) {
  return runAction(async () => {
    await requireAdmin();
    await catalog.resolveReport(id.parse(reportId), z.enum(["RESOLVED", "DISMISSED"]).parse(status));
    refresh();
  });
}
