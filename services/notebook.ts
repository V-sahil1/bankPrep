import { prisma } from "@/lib/prisma";
import { questionViewInclude, toClientQuestion, toReveal } from "@/services/question-view";

export async function getBookmarks(userId: string) {
  const rows = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { question: { include: questionViewInclude } },
  });
  return rows.map((row) => ({
    id: row.id,
    createdAt: row.createdAt,
    examId: row.question.examId,
    subjectId: row.question.subjectId,
    topicId: row.question.topicId,
    question: toClientQuestion(row.question),
    // A bookmark is a study note: the user may read the answer directly.
    reveal: toReveal(row.question),
  }));
}

export type BookmarkEntry = Awaited<ReturnType<typeof getBookmarks>>[number];

export async function getMistakes(userId: string) {
  const rows = await prisma.mistake.findMany({
    where: { userId },
    orderBy: [{ isResolved: "asc" }, { lastWrongAt: "desc" }],
    include: { question: { include: questionViewInclude } },
  });
  return rows.map((row) => ({
    id: row.id,
    questionId: row.questionId,
    wrongCount: row.wrongCount,
    correctRetryCount: row.correctRetryCount,
    isResolved: row.isResolved,
    lastWrongAt: row.lastWrongAt,
    lastWrongOptionId: row.lastWrongOptionId,
    question: toClientQuestion(row.question),
    reveal: toReveal(row.question),
  }));
}

export type MistakeEntry = Awaited<ReturnType<typeof getMistakes>>[number];

export async function getVerifiedPyqSummary() {
  const rows = await prisma.question.groupBy({
    by: ["examId", "topicId"],
    where: { sourceType: "PYQ", status: "APPROVED", pyqVerifiedAt: { not: null } },
    _count: { _all: true },
  });
  const [exams, topics] = await Promise.all([
    prisma.exam.findMany({ where: { id: { in: rows.map((r) => r.examId) } }, select: { id: true, name: true, order: true } }),
    prisma.topic.findMany({ where: { id: { in: rows.map((r) => r.topicId) } }, select: { id: true, name: true } }),
  ]);
  const topicName = new Map(topics.map((t) => [t.id, t.name]));
  return exams
    .sort((a, b) => a.order - b.order)
    .map((exam) => {
      const examRows = rows.filter((r) => r.examId === exam.id);
      return {
        examId: exam.id,
        examName: exam.name,
        total: examRows.reduce((sum, r) => sum + r._count._all, 0),
        topics: examRows.map((r) => ({ topicId: r.topicId, name: topicName.get(r.topicId) ?? "Topic", count: r._count._all })),
      };
    });
}
