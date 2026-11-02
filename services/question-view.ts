import type { Prisma } from "@prisma/client";

/** Only approved questions are served, and a PYQ only once an admin verified it. */
export const servableWhere: Prisma.QuestionWhereInput = {
  status: "APPROVED",
  OR: [{ sourceType: { not: "PYQ" } }, { pyqVerifiedAt: { not: null } }],
};

export const questionViewInclude = {
  options: { orderBy: { order: "asc" } },
  context: true,
  topic: { select: { name: true } },
  subject: { select: { name: true } },
  exam: { select: { shortName: true } },
} satisfies Prisma.QuestionInclude;

type QuestionWithView = Prisma.QuestionGetPayload<{ include: typeof questionViewInclude }>;

export type ClientContext = {
  id: string;
  type: "PASSAGE" | "DATA_SET";
  title: string;
  content: string;
  table: { columns: string[]; rows: (string | number)[][] } | null;
};

/** Safe to send before the answer is revealed: no answer key, no explanation. */
export type ClientQuestion = {
  id: string;
  format: QuestionWithView["format"];
  questionText: string;
  formatData: unknown;
  difficulty: QuestionWithView["difficulty"];
  sourceType: QuestionWithView["sourceType"];
  sourceReference: string | null;
  pyqVerified: boolean;
  topicName: string;
  subjectName: string;
  examName: string;
  tags: string[];
  context: ClientContext | null;
  options: { id: string; text: string }[];
};

export type Reveal = { correctOptionId: string | null; explanation: string };

export function toClientQuestion(q: QuestionWithView): ClientQuestion {
  return {
    id: q.id,
    format: q.format,
    questionText: q.questionText,
    formatData: q.formatData,
    difficulty: q.difficulty,
    sourceType: q.sourceType,
    sourceReference: q.sourceReference,
    pyqVerified: q.sourceType === "PYQ" && q.pyqVerifiedAt !== null,
    topicName: q.topic.name,
    subjectName: q.subject.name,
    examName: q.exam.shortName,
    tags: q.tags,
    context: q.context
      ? {
          id: q.context.id,
          type: q.context.type,
          title: q.context.title,
          content: q.context.content,
          table: (q.context.table as ClientContext["table"]) ?? null,
        }
      : null,
    options: q.options.map((o) => ({ id: o.id, text: o.text })),
  };
}

export function toReveal(q: Pick<QuestionWithView, "options" | "explanation">): Reveal {
  return {
    correctOptionId: q.options.find((o) => o.isCorrect)?.id ?? null,
    explanation: q.explanation,
  };
}

/** Fisher-Yates, with the random source injectable for tests. */
export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

type SelectableQuestion = { id: string; contextId: string | null };

/**
 * Picks questions, serving ones the user has not seen first, then keeps questions
 * on the same passage or data set next to each other in the final order.
 */
export function pickQuestions<T extends SelectableQuestion>(
  candidates: T[],
  seenIds: Set<string>,
  count: number,
  random: () => number = Math.random,
): T[] {
  const unseen = shuffle(candidates.filter((c) => !seenIds.has(c.id)), random);
  const seen = shuffle(candidates.filter((c) => seenIds.has(c.id)), random);
  const picked = [...unseen, ...seen].slice(0, count);

  const ordered: T[] = [];
  const placed = new Set<string>();
  for (const question of picked) {
    if (placed.has(question.id)) continue;
    const group = question.contextId ? picked.filter((p) => p.contextId === question.contextId) : [question];
    for (const member of group) {
      ordered.push(member);
      placed.add(member.id);
    }
  }
  return ordered;
}
