import { z } from "zod";

export const difficultySchema = z.enum(["EASY", "MEDIUM", "HARD"]);
export const formatSchema = z.enum([
  "MCQ",
  "MULTIPLE_STATEMENTS",
  "ASSERTION_REASON",
  "MATCH_THE_FOLLOWING",
  "PASSAGE",
  "DATA_INTERPRETATION",
]);
export const sourceTypeSchema = z.enum(["ILLUSTRATIVE_SAMPLE", "ADMIN_AUTHORED", "AI_GENERATED", "PYQ"]);

export const formatDataSchema = z
  .union([
    z.object({ statements: z.array(z.string().trim().min(1)).min(2) }),
    z.object({ assertion: z.string().trim().min(1), reason: z.string().trim().min(1) }),
    z.object({ columnA: z.array(z.string().trim().min(1)).min(2), columnB: z.array(z.string().trim().min(1)).min(2) }),
  ])
  .nullable();

export type FormatData = z.infer<typeof formatDataSchema>;

export const optionsSchema = z
  .array(z.string().trim().min(1, "Every option needs text.").max(1000))
  .length(4, "Provide exactly four options.")
  .refine((options) => new Set(options.map((o) => o.toLowerCase())).size === 4, "Options must all be different.");

const tags = z.array(z.string().trim().toLowerCase().min(1).max(40)).max(10).default([]);

/** The parts of a question that do not depend on how catalog ids were resolved. */
const questionContent = {
  questionText: z.string().trim().min(5, "Enter the question text.").max(5000),
  options: optionsSchema,
  correctIndex: z.coerce.number().int().min(0).max(3),
  explanation: z.string().trim().min(5, "Enter an explanation.").max(5000),
  difficulty: difficultySchema,
  format: formatSchema.default("MCQ"),
  formatData: formatDataSchema.default(null),
  tags,
};

export const questionFormSchema = z
  .object({
    ...questionContent,
    examId: z.string().min(1, "Select an exam."),
    subjectId: z.string().min(1, "Select a subject."),
    topicId: z.string().min(1, "Select a topic."),
    subtopicName: z.string().trim().max(100).optional(),
    relevantExamIds: z.array(z.string()).default([]),
    contextId: z.string().nullable().default(null),
    sourceType: sourceTypeSchema,
    sourceReference: z.string().trim().max(500).nullable().default(null),
  })
  .superRefine((value, ctx) => {
    if (value.sourceType === "PYQ" && !value.sourceReference) {
      ctx.addIssue({
        code: "custom",
        path: ["sourceReference"],
        message: "A previous-year question needs its source (exam, year, shift).",
      });
    }
  });

export type QuestionFormInput = z.input<typeof questionFormSchema>;

/** One row of a CSV or JSON import. Catalog references are by slug and name. */
export const importRowSchema = z
  .object({
    ...questionContent,
    examSlug: z.string().trim().min(1, "examSlug is required."),
    subjectSlug: z.string().trim().min(1, "subjectSlug is required."),
    topic: z.string().trim().min(1, "topic is required."),
    subtopic: z.string().trim().optional(),
    relevantExamSlugs: z.array(z.string().trim().min(1)).default([]),
    sourceType: sourceTypeSchema.exclude(["AI_GENERATED"]).default("ADMIN_AUTHORED"),
    sourceReference: z.string().trim().max(500).nullable().default(null),
  })
  .superRefine((value, ctx) => {
    if (value.sourceType === "PYQ" && !value.sourceReference) {
      ctx.addIssue({ code: "custom", path: ["sourceReference"], message: "PYQ rows need a sourceReference." });
    }
  });

export type ImportRow = z.infer<typeof importRowSchema>;

/** Flattens a CSV record's option_a..option_d columns into the shape of importRowSchema. */
export function csvRecordToImportRow(record: Record<string, string>): unknown {
  const split = (value?: string) =>
    (value ?? "")
      .split("|")
      .map((part) => part.trim())
      .filter(Boolean);
  const answer = (record.correct ?? "").trim().toUpperCase();
  const letterIndex = ["A", "B", "C", "D"].indexOf(answer);
  return {
    examSlug: record.examSlug,
    subjectSlug: record.subjectSlug,
    topic: record.topic,
    subtopic: record.subtopic || undefined,
    questionText: record.questionText,
    options: [record.optionA, record.optionB, record.optionC, record.optionD],
    correctIndex: letterIndex === -1 ? -1 : letterIndex,
    explanation: record.explanation,
    difficulty: (record.difficulty ?? "").trim().toUpperCase(),
    format: "MCQ",
    formatData: null,
    tags: split(record.tags),
    relevantExamSlugs: split(record.relevantExamSlugs),
    sourceType: record.sourceType?.trim() ? record.sourceType.trim().toUpperCase() : undefined,
    sourceReference: record.sourceReference?.trim() || null,
  };
}

/** What the LLM must return. Kept free of constraints the API schema cannot express. */
export const aiGeneratedSetSchema = z.object({
  questions: z.array(
    z.object({
      questionText: z.string(),
      options: z.array(z.string()),
      correctIndex: z.number(),
      explanation: z.string(),
      tags: z.array(z.string()),
    }),
  ),
});

/** The strict check every generated question must pass before it is stored. */
export const aiQuestionSchema = z.object({
  questionText: z.string().trim().min(10).max(5000),
  options: optionsSchema,
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().trim().min(20).max(5000),
  tags,
});

export const aiGenerationRequestSchema = z.object({
  examId: z.string().min(1, "Select an exam."),
  subjectId: z.string().min(1, "Select a subject."),
  topicId: z.string().min(1, "Select a topic."),
  difficulty: difficultySchema,
  count: z.coerce.number().int().min(1, "Generate at least 1 question.").max(20, "Generate at most 20 at a time."),
});
