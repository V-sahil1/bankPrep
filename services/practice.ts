import { Difficulty, type Prisma } from "@prisma/client";
import { z } from "zod";
import { AppError } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { applyFinalizedAnswers } from "@/services/progress";
import {
  pickQuestions,
  questionViewInclude,
  servableWhere,
  toClientQuestion,
  toReveal,
  type ClientQuestion,
  type Reveal,
} from "@/services/question-view";
import { startListSessionSchema, startTopicSessionSchema, submitAnswerSchema } from "@/validations/practice";

type TopicSessionInput = z.infer<typeof startTopicSessionSchema>;
type ListSessionInput = z.infer<typeof startListSessionSchema>;

async function createSessionFromCandidates(
  userId: string,
  where: Prisma.QuestionWhereInput,
  count: number,
  data: Omit<Prisma.PracticeSessionUncheckedCreateInput, "userId" | "questionCount">,
) {
  const candidates = await prisma.question.findMany({
    where: { AND: [servableWhere, where] },
    select: { id: true, contextId: true },
  });
  if (candidates.length === 0) {
    throw new AppError("No questions match that selection yet. Try a different difficulty or topic.");
  }

  const seen = await prisma.userAnswer.findMany({
    where: { userId, questionId: { in: candidates.map((c) => c.id) }, finalizedAt: { not: null } },
    select: { questionId: true },
    distinct: ["questionId"],
  });
  const picked = pickQuestions(candidates, new Set(seen.map((s) => s.questionId)), count);

  const session = await prisma.practiceSession.create({
    data: {
      ...data,
      userId,
      questionCount: picked.length,
      questions: { create: picked.map((q, order) => ({ questionId: q.id, order })) },
    },
    select: { id: true, questionCount: true },
  });
  return { sessionId: session.id, served: session.questionCount, requested: count };
}

export async function startTopicSession(userId: string, input: TopicSessionInput) {
  const topic = await prisma.topic.findFirst({
    where: { id: input.topicId, subjectId: input.subjectId },
    select: { id: true },
  });
  if (!topic) throw new AppError("That topic does not belong to the selected subject.");

  const useExam = !input.common;
  if (useExam) {
    // The exam's configuration decides what can be practised, not just the catalog.
    const configured = await prisma.examTopic.findFirst({
      where: { examId: input.examId!, topicId: input.topicId, isActive: true },
      select: { topicId: true },
    });
    if (!configured) throw new AppError("That topic is not part of the selected exam.");
  }

  return createSessionFromCandidates(
    userId,
    {
      topicId: input.topicId,
      ...(input.difficulty === "MIXED" ? {} : { difficulty: input.difficulty }),
      ...(useExam ? { relevantExams: { some: { examId: input.examId! } } } : {}),
    },
    input.count,
    {
      examId: useExam ? input.examId : null,
      subjectId: input.subjectId,
      topicId: input.topicId,
      difficulty: input.difficulty === "MIXED" ? null : input.difficulty,
      mode: input.mode,
      scope: useExam ? "TOPIC" : "COMMON_TOPIC",
    },
  );
}

export async function startListSession(userId: string, input: ListSessionInput) {
  const filter: Prisma.QuestionWhereInput = {
    ...(input.questionId ? { id: input.questionId } : {}),
    ...(input.subjectId ? { subjectId: input.subjectId } : {}),
    ...(input.topicId ? { topicId: input.topicId } : {}),
  };
  const examFilter: Prisma.QuestionWhereInput = input.examId ? { examId: input.examId } : {};

  let where: Prisma.QuestionWhereInput;
  let scope: "BOOKMARKS" | "MISTAKES" | "PYQ";
  if (input.source === "BOOKMARKS") {
    scope = "BOOKMARKS";
    where = { ...filter, ...examFilter, bookmarks: { some: { userId } } };
  } else if (input.source === "MISTAKES") {
    scope = "MISTAKES";
    where = {
      ...filter,
      ...examFilter,
      mistakes: { some: input.questionId ? { userId } : { userId, isResolved: false } },
    };
  } else {
    scope = "PYQ";
    where = { ...filter, ...examFilter, sourceType: "PYQ", pyqVerifiedAt: { not: null } };
  }

  return createSessionFromCandidates(userId, where, input.count ?? 100, {
    examId: input.examId ?? null,
    subjectId: input.subjectId ?? null,
    topicId: input.topicId ?? null,
    mode: input.mode,
    scope,
  });
}

export type SessionQuestionView = {
  question: ClientQuestion;
  order: number;
  markedForReview: boolean;
  skipped: boolean;
  selectedOptionId: string | null;
  /** Present only when the server has decided the answer may be shown. */
  reveal: (Reveal & { isCorrect: boolean | null }) | null;
};

export type SessionView = {
  id: string;
  mode: "PRACTICE" | "TEST";
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  scope: string;
  title: string;
  subtitle: string;
  /** For a "practise this topic again" link; null for notebook and PYQ sessions. */
  again: { subjectId: string; topicId: string; examSlug: string | null } | null;
  currentIndex: number;
  questionCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  timeSpentSec: number;
  startedAt: Date;
  completedAt: Date | null;
  bookmarkedIds: string[];
  items: SessionQuestionView[];
};

const SCOPE_TITLES: Record<string, string> = {
  BOOKMARKS: "Bookmarked questions",
  MISTAKES: "Mistake retry",
  PYQ: "Previous year questions",
};

export async function getSessionView(userId: string, sessionId: string): Promise<SessionView | null> {
  // Scoping by userId is what keeps one user out of another's session.
  const session = await prisma.practiceSession.findFirst({
    where: { id: sessionId, userId },
    include: {
      exam: { select: { name: true, slug: true } },
      topic: { select: { name: true } },
      subject: { select: { name: true } },
      answers: true,
      questions: {
        orderBy: { order: "asc" },
        include: { question: { include: questionViewInclude } },
      },
    },
  });
  if (!session) return null;

  const answerByQuestion = new Map(session.answers.map((a) => [a.questionId, a]));
  const finished = session.status !== "IN_PROGRESS";
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId, questionId: { in: session.questions.map((q) => q.questionId) } },
    select: { questionId: true },
  });

  return {
    id: session.id,
    mode: session.mode,
    status: session.status,
    scope: session.scope,
    title: session.topic?.name ?? SCOPE_TITLES[session.scope] ?? "Practice",
    subtitle: [session.exam?.name ?? (session.scope === "COMMON_TOPIC" ? "Common practice" : null), session.subject?.name]
      .filter(Boolean)
      .join(" · "),
    again:
      session.topicId && session.subjectId
        ? { subjectId: session.subjectId, topicId: session.topicId, examSlug: session.exam?.slug ?? null }
        : null,
    currentIndex: session.currentIndex,
    questionCount: session.questionCount,
    correctCount: session.correctCount,
    incorrectCount: session.incorrectCount,
    skippedCount: session.skippedCount,
    timeSpentSec: session.timeSpentSec,
    startedAt: session.startedAt,
    completedAt: session.completedAt,
    bookmarkedIds: bookmarks.map((b) => b.questionId),
    items: session.questions.map((sq) => {
      const answer = answerByQuestion.get(sq.questionId);
      const answeredInPractice = session.mode === "PRACTICE" && Boolean(answer);
      const canReveal = finished || answeredInPractice || sq.revealed;
      return {
        question: toClientQuestion(sq.question),
        order: sq.order,
        markedForReview: sq.markedForReview,
        skipped: sq.skipped,
        selectedOptionId: answer?.selectedOptionId ?? null,
        reveal: canReveal
          ? { ...toReveal(sq.question), isCorrect: answer ? answer.isCorrect : null }
          : null,
      };
    }),
  };
}

async function loadOwnedSessionQuestion(userId: string, sessionId: string, questionId: string) {
  const session = await prisma.practiceSession.findFirst({
    where: { id: sessionId, userId },
    select: { id: true, mode: true, status: true },
  });
  if (!session) throw new AppError("Session not found.");
  if (session.status !== "IN_PROGRESS") throw new AppError("This session has already finished.");

  const link = await prisma.sessionQuestion.findUnique({
    where: { sessionId_questionId: { sessionId, questionId } },
    include: { question: { include: { options: true } } },
  });
  if (!link) throw new AppError("That question is not part of this session.");
  return { session, link };
}

export type SubmitResult =
  | { mode: "TEST"; saved: true }
  | { mode: "PRACTICE"; isCorrect: boolean; correctOptionId: string | null; explanation: string };

export async function submitAnswer(userId: string, input: z.infer<typeof submitAnswerSchema>): Promise<SubmitResult> {
  const { session, link } = await loadOwnedSessionQuestion(userId, input.sessionId, input.questionId);
  const { question } = link;

  const option = question.options.find((o) => o.id === input.optionId);
  if (!option) throw new AppError("That option does not belong to this question.");
  if (link.revealed) throw new AppError("You viewed the explanation for this question, so it can't be answered for credit.");

  const shared = {
    userId,
    sessionId: session.id,
    questionId: question.id,
    selectedOptionId: option.id,
    isCorrect: option.isCorrect,
    topicId: question.topicId,
    subjectId: question.subjectId,
    difficulty: question.difficulty,
  };
  const existing = await prisma.userAnswer.findUnique({
    where: { sessionId_questionId: { sessionId: session.id, questionId: question.id } },
  });

  if (session.mode === "TEST") {
    // Test answers can change until the end and only then count for stats.
    await prisma.$transaction([
      existing
        ? prisma.userAnswer.update({
            where: { id: existing.id },
            data: {
              selectedOptionId: option.id,
              isCorrect: option.isCorrect,
              timeSpentSec: { increment: input.timeSpentSec },
              answeredAt: new Date(),
            },
          })
        : prisma.userAnswer.create({ data: { ...shared, timeSpentSec: input.timeSpentSec } }),
      prisma.sessionQuestion.update({
        where: { sessionId_questionId: { sessionId: session.id, questionId: question.id } },
        data: { skipped: false },
      }),
    ]);
    return { mode: "TEST", saved: true };
  }

  if (existing) throw new AppError("You have already answered this question.");

  const now = new Date();
  await prisma.$transaction(async (tx) => {
    await tx.userAnswer.create({ data: { ...shared, timeSpentSec: input.timeSpentSec, finalizedAt: now } });
    await tx.sessionQuestion.update({
      where: { sessionId_questionId: { sessionId: session.id, questionId: question.id } },
      data: { skipped: false },
    });
    await tx.practiceSession.update({
      where: { id: session.id },
      data: {
        correctCount: { increment: option.isCorrect ? 1 : 0 },
        incorrectCount: { increment: option.isCorrect ? 0 : 1 },
        timeSpentSec: { increment: input.timeSpentSec },
      },
    });
    await applyFinalizedAnswers(
      tx,
      userId,
      [{ questionId: question.id, selectedOptionId: option.id, isCorrect: option.isCorrect, timeSpentSec: input.timeSpentSec }],
      now,
    );
  });

  return { mode: "PRACTICE", isCorrect: option.isCorrect, ...toReveal(question) };
}

export async function skipQuestion(userId: string, sessionId: string, questionId: string) {
  await loadOwnedSessionQuestion(userId, sessionId, questionId);
  const answered = await prisma.userAnswer.findUnique({
    where: { sessionId_questionId: { sessionId, questionId } },
    select: { id: true },
  });
  if (answered) return;
  await prisma.sessionQuestion.update({
    where: { sessionId_questionId: { sessionId, questionId } },
    data: { skipped: true },
  });
}

export async function toggleReviewMark(userId: string, sessionId: string, questionId: string) {
  const { link } = await loadOwnedSessionQuestion(userId, sessionId, questionId);
  const updated = await prisma.sessionQuestion.update({
    where: { sessionId_questionId: { sessionId, questionId } },
    data: { markedForReview: !link.markedForReview },
    select: { markedForReview: true },
  });
  return updated.markedForReview;
}

/** Practice mode only: show the answer without attempting; the question then earns no credit. */
export async function revealQuestion(userId: string, sessionId: string, questionId: string): Promise<Reveal> {
  const { session, link } = await loadOwnedSessionQuestion(userId, sessionId, questionId);
  if (session.mode !== "PRACTICE") throw new AppError("Explanations are hidden until a test is finished.");
  await prisma.sessionQuestion.update({
    where: { sessionId_questionId: { sessionId, questionId } },
    data: { revealed: true, skipped: true },
  });
  return toReveal(link.question);
}

export async function saveSessionPosition(userId: string, sessionId: string, index: number) {
  await prisma.practiceSession.updateMany({
    where: { id: sessionId, userId, status: "IN_PROGRESS", questionCount: { gt: index } },
    data: { currentIndex: Math.max(0, index) },
  });
}

export async function finishSession(userId: string, sessionId: string) {
  const session = await prisma.practiceSession.findFirst({
    where: { id: sessionId, userId },
    select: { id: true, status: true, questionCount: true },
  });
  if (!session) throw new AppError("Session not found.");
  if (session.status === "COMPLETED") return;

  const now = new Date();
  await prisma.$transaction(async (tx) => {
    const pending = await tx.userAnswer.findMany({ where: { sessionId, finalizedAt: null } });
    await tx.userAnswer.updateMany({ where: { sessionId, finalizedAt: null }, data: { finalizedAt: now } });
    await applyFinalizedAnswers(tx, userId, pending, now);

    const all = await tx.userAnswer.findMany({
      where: { sessionId },
      select: { isCorrect: true, timeSpentSec: true },
    });
    const correct = all.filter((a) => a.isCorrect).length;
    await tx.practiceSession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        completedAt: now,
        correctCount: correct,
        incorrectCount: all.length - correct,
        skippedCount: session.questionCount - all.length,
        timeSpentSec: all.reduce((sum, a) => sum + a.timeSpentSec, 0),
      },
    });
  });
}

export async function abandonSession(userId: string, sessionId: string) {
  // Unsubmitted test answers go with the session: they were never counted.
  await prisma.$transaction([
    prisma.userAnswer.deleteMany({ where: { sessionId, userId, finalizedAt: null } }),
    prisma.practiceSession.updateMany({
      where: { id: sessionId, userId, status: "IN_PROGRESS" },
      data: { status: "ABANDONED", completedAt: new Date() },
    }),
  ]);
}

export async function toggleBookmark(userId: string, questionId: string): Promise<boolean> {
  const existing = await prisma.bookmark.findUnique({
    where: { userId_questionId: { userId, questionId } },
    select: { id: true },
  });
  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return false;
  }
  const question = await prisma.question.findUnique({ where: { id: questionId }, select: { id: true } });
  if (!question) throw new AppError("Question not found.");
  await prisma.bookmark.create({ data: { userId, questionId } });
  return true;
}

export async function reportQuestion(userId: string, questionId: string, reason: string, details?: string) {
  const question = await prisma.question.findUnique({ where: { id: questionId }, select: { id: true } });
  if (!question) throw new AppError("Question not found.");
  await prisma.questionReport.create({ data: { userId, questionId, reason, details: details || null } });
}

/** Availability for the practice picker. Counts are by topic and difficulty. */
export async function getTopicAvailability(examId: string | null) {
  const rows = await prisma.question.groupBy({
    by: ["topicId", "difficulty"],
    where: { AND: [servableWhere, examId ? { relevantExams: { some: { examId } } } : {}] },
    _count: { _all: true },
  });
  const byTopic: Record<string, TopicAvailability> = {};
  for (const row of rows) {
    const entry = (byTopic[row.topicId] ??= emptyAvailability());
    entry[row.difficulty] = row._count._all;
  }
  return byTopic;
}

/** Question counts per difficulty, with every enum value present so callers can index freely. */
export type TopicAvailability = Record<Difficulty, number>;

export function emptyAvailability(): TopicAvailability {
  return Object.fromEntries(Object.values(Difficulty).map((d) => [d, 0])) as TopicAvailability;
}

export async function getPracticeCatalog() {
  const [exams, subjects] = await Promise.all([
    prisma.exam.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        subjects: { where: { isActive: true }, orderBy: { order: "asc" }, select: { subjectId: true } },
        topics: { where: { isActive: true }, select: { topicId: true } },
      },
    }),
    prisma.subject.findMany({
      orderBy: { order: "asc" },
      include: { topics: { orderBy: { order: "asc" }, select: { id: true, name: true } } },
    }),
  ]);

  return {
    exams: exams.map((e) => ({
      id: e.id,
      slug: e.slug,
      name: e.name,
      shortName: e.shortName,
      description: e.description,
      subjectIds: e.subjects.map((s) => s.subjectId),
      topicIds: e.topics.map((t) => t.topicId),
    })),
    subjects: subjects.map((s) => ({ id: s.id, name: s.name, topics: s.topics })),
  };
}

export type PracticeCatalog = Awaited<ReturnType<typeof getPracticeCatalog>>;
