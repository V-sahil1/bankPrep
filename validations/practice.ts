import { z } from "zod";

export const MAX_SESSION_QUESTIONS = 100;

const questionCount = z.coerce
  .number()
  .int("Enter a whole number of questions.")
  .min(1, "Choose at least 1 question.")
  .max(MAX_SESSION_QUESTIONS, `A session can have at most ${MAX_SESSION_QUESTIONS} questions.`);

export const practiceModeSchema = z.enum(["PRACTICE", "TEST"]);
export const difficultyChoiceSchema = z.enum(["EASY", "MEDIUM", "HARD", "MIXED"]);

export const startTopicSessionSchema = z
  .object({
    common: z.boolean().default(false),
    examId: z.string().nullable(),
    subjectId: z.string().min(1, "Select a subject."),
    topicId: z.string().min(1, "Select a topic."),
    difficulty: difficultyChoiceSchema,
    count: questionCount,
    mode: practiceModeSchema,
  })
  .refine((v) => v.common || Boolean(v.examId), { message: "Select an examination.", path: ["examId"] });

export const startListSessionSchema = z.object({
  source: z.enum(["BOOKMARKS", "MISTAKES", "PYQ"]),
  mode: practiceModeSchema.default("PRACTICE"),
  count: questionCount.optional(),
  examId: z.string().optional(),
  subjectId: z.string().optional(),
  topicId: z.string().optional(),
  questionId: z.string().optional(),
});

export const submitAnswerSchema = z.object({
  sessionId: z.string().min(1),
  questionId: z.string().min(1),
  optionId: z.string().min(1, "Select an option first."),
  timeSpentSec: z.coerce.number().int().min(0).max(3600).default(0),
});

export const reportQuestionSchema = z.object({
  questionId: z.string().min(1),
  reason: z.enum(["WRONG_ANSWER", "WRONG_EXPLANATION", "TYPO", "UNCLEAR", "OTHER"]),
  details: z.string().trim().max(1000).optional(),
});

export const REPORT_REASONS: Record<z.infer<typeof reportQuestionSchema>["reason"], string> = {
  WRONG_ANSWER: "The marked answer is wrong",
  WRONG_EXPLANATION: "The explanation is wrong",
  TYPO: "Typo or formatting problem",
  UNCLEAR: "The question is unclear",
  OTHER: "Something else",
};
