import { AppError } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { resolveSectionTiming, scoreAttempt, type ScoreLine } from "@/lib/scoring";
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

/** Answers arriving this long after the deadline are accepted, to absorb network lag. */
const GRACE_SECONDS = 5;

export async function listMockTests(userId: string) {
  const tests = await prisma.mockTest.findMany({
    where: { isActive: true, exam: { isActive: true } },
    orderBy: [{ exam: { order: "asc" } }, { scalePercent: "asc" }],
    include: {
      exam: { select: { id: true, name: true, shortName: true } },
      pattern: { include: { sections: { orderBy: { order: "asc" } } } },
      attempts: {
        where: { userId },
        orderBy: { startedAt: "desc" },
        select: { id: true, status: true, score: true, maxScore: true, startedAt: true },
      },
    },
  });
  return tests.map((test) => {
    const sections = test.pattern.sections.map((s) => scaleSection(s, test.scalePercent));
    return {
      id: test.id,
      title: test.title,
      description: test.description,
      scalePercent: test.scalePercent,
      exam: test.exam,
      patternName: test.pattern.name,
      patternVerified: test.pattern.verifiedAt !== null,
      patternNotes: test.pattern.notes,
      sectionalTiming: test.pattern.sectionalTiming,
      totalQuestions: sections.reduce((sum, s) => sum + s.questionCount, 0),
      totalMinutes: test.pattern.sectionalTiming
        ? Math.ceil(sections.reduce((sum, s) => sum + s.seconds, 0) / 60)
        : Math.ceil(((test.pattern.compositeMinutes ?? 0) * test.scalePercent) / 100),
      sections: sections.map((s) => ({
        name: s.name,
        questionCount: s.questionCount,
        minutes: Math.ceil(s.seconds / 60),
        marksPerQuestion: s.marksPerQuestion,
        negativeMarks: s.negativeMarks,
      })),
      attempts: test.attempts,
    };
  });
}

type RawSection = {
  id: string;
  subjectId: string;
  name: string;
  questionCount: number;
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMarks: number;
  order: number;
};

function scaleSection(section: RawSection, scalePercent: number) {
  return {
    ...section,
    questionCount: Math.max(1, Math.ceil((section.questionCount * scalePercent) / 100)),
    seconds: Math.max(60, Math.ceil((section.durationMinutes * 60 * scalePercent) / 100)),
  };
}

export async function startMockAttempt(userId: string, mockTestId: string) {
  const test = await prisma.mockTest.findFirst({
    where: { id: mockTestId, isActive: true },
    include: { pattern: { include: { sections: { orderBy: { order: "asc" } } } } },
  });
  if (!test) throw new AppError("That mock test is not available.");
  if (test.pattern.sections.length === 0) throw new AppError("This mock test has no sections configured yet.");

  const running = await prisma.mockTestAttempt.findFirst({
    where: { userId, mockTestId, status: "IN_PROGRESS" },
    select: { id: true },
  });
  if (running) return { attemptId: running.id, resumed: true };

  const sections = test.pattern.sections.map((s) => scaleSection(s, test.scalePercent));
  const seen = new Set(
    (
      await prisma.userAnswer.findMany({
        where: { userId, finalizedAt: { not: null } },
        select: { questionId: true },
        distinct: ["questionId"],
      })
    ).map((a) => a.questionId),
  );

  const usedIds = new Set<string>();
  const rows: {
    questionId: string;
    sectionId: string;
    sectionIndex: number;
    sectionName: string;
    sectionSeconds: number;
    marksPerQuestion: number;
    negativeMarks: number;
    order: number;
  }[] = [];
  const servedSections: typeof sections = [];

  for (const section of sections) {
    const candidates = await prisma.question.findMany({
      where: {
        AND: [servableWhere, { subjectId: section.subjectId, relevantExams: { some: { examId: test.examId } } }],
      },
      select: { id: true, contextId: true },
    });
    const picked = pickQuestions(candidates.filter((c) => !usedIds.has(c.id)), seen, section.questionCount);
    if (picked.length === 0) continue;

    const sectionIndex = servedSections.length;
    servedSections.push(section);
    for (const question of picked) {
      usedIds.add(question.id);
      rows.push({
        questionId: question.id,
        sectionId: section.id,
        sectionIndex,
        sectionName: section.name,
        sectionSeconds: section.seconds,
        marksPerQuestion: section.marksPerQuestion,
        negativeMarks: section.negativeMarks,
        order: rows.length,
      });
    }
  }

  if (rows.length === 0) throw new AppError("The question bank has no questions for this mock test yet.");

  const requestedCount = sections.reduce((sum, s) => sum + s.questionCount, 0);
  const sectionalTiming = test.pattern.sectionalTiming;
  const totalSeconds = sectionalTiming
    ? servedSections.reduce((sum, s) => sum + s.seconds, 0)
    : Math.ceil(((test.pattern.compositeMinutes ?? 60) * 60 * test.scalePercent) / 100);

  const attempt = await prisma.mockTestAttempt.create({
    data: {
      userId,
      mockTestId,
      sectionalTiming,
      totalSeconds,
      requestedCount,
      servedCount: rows.length,
      questions: { create: rows },
    },
    select: { id: true },
  });
  return { attemptId: attempt.id, resumed: false };
}

async function loadAttempt(userId: string, attemptId: string) {
  return prisma.mockTestAttempt.findFirst({
    where: { id: attemptId, userId },
    include: {
      mockTest: { select: { title: true, exam: { select: { name: true } } } },
      questions: { orderBy: { order: "asc" }, include: { question: { include: questionViewInclude } } },
      answers: true,
    },
  });
}

type LoadedAttempt = NonNullable<Awaited<ReturnType<typeof loadAttempt>>>;

function sectionTimings(attempt: LoadedAttempt) {
  const seenIndexes = new Map<number, number>();
  for (const q of attempt.questions) seenIndexes.set(q.sectionIndex, q.sectionSeconds);
  return [...seenIndexes.entries()].map(([index, seconds]) => ({ index, seconds }));
}

/** Current timer state from wall-clock time. The client's countdown is display only. */
function timingFor(attempt: LoadedAttempt, now: Date) {
  if (attempt.sectionalTiming) {
    return resolveSectionTiming(sectionTimings(attempt), attempt.currentSectionIndex, attempt.sectionStartedAt, now);
  }
  const secondsLeft = Math.ceil((attempt.startedAt.getTime() + attempt.totalSeconds * 1000 - now.getTime()) / 1000);
  return secondsLeft > 0
    ? ({ status: "running", sectionIndex: attempt.currentSectionIndex, sectionStartedAt: attempt.startedAt, secondsLeft } as const)
    : ({ status: "expired" } as const);
}

export type MockAttemptItem = {
  question: ClientQuestion;
  order: number;
  sectionIndex: number;
  sectionName: string;
  marksPerQuestion: number;
  negativeMarks: number;
  markedForReview: boolean;
  visited: boolean;
  selectedOptionId: string | null;
};

export type MockAttemptView = {
  id: string;
  title: string;
  examName: string;
  sectionalTiming: boolean;
  currentSectionIndex: number;
  secondsLeft: number;
  requestedCount: number;
  servedCount: number;
  sections: { index: number; name: string; questionCount: number }[];
  items: MockAttemptItem[];
};

/**
 * Loads a running attempt, first catching it up with the clock. Returns
 * { submitted: true } when time ran out while the user was away.
 */
export async function getRunningAttempt(
  userId: string,
  attemptId: string,
): Promise<{ submitted: true } | { submitted: false; view: MockAttemptView } | null> {
  const attempt = await loadAttempt(userId, attemptId);
  if (!attempt) return null;
  if (attempt.status === "SUBMITTED") return { submitted: true };

  const now = new Date();
  const timing = timingFor(attempt, now);
  if (timing.status === "expired") {
    await submitAttempt(userId, attemptId, true);
    return { submitted: true };
  }

  if (attempt.sectionalTiming && timing.sectionIndex !== attempt.currentSectionIndex) {
    await prisma.mockTestAttempt.update({
      where: { id: attemptId },
      data: { currentSectionIndex: timing.sectionIndex, sectionStartedAt: timing.sectionStartedAt },
    });
  }

  const answers = new Map(attempt.answers.map((a) => [a.questionId, a.selectedOptionId]));
  const sections = new Map<number, { index: number; name: string; questionCount: number }>();
  for (const q of attempt.questions) {
    const section = sections.get(q.sectionIndex) ?? { index: q.sectionIndex, name: q.sectionName, questionCount: 0 };
    section.questionCount += 1;
    sections.set(q.sectionIndex, section);
  }

  return {
    submitted: false,
    view: {
      id: attempt.id,
      title: attempt.mockTest.title,
      examName: attempt.mockTest.exam.name,
      sectionalTiming: attempt.sectionalTiming,
      currentSectionIndex: timing.sectionIndex,
      secondsLeft: timing.secondsLeft,
      requestedCount: attempt.requestedCount,
      servedCount: attempt.servedCount,
      sections: [...sections.values()],
      items: attempt.questions.map((q) => ({
        question: toClientQuestion(q.question),
        order: q.order,
        sectionIndex: q.sectionIndex,
        sectionName: q.sectionName,
        marksPerQuestion: q.marksPerQuestion,
        negativeMarks: q.negativeMarks,
        markedForReview: q.markedForReview,
        visited: q.visited,
        selectedOptionId: answers.get(q.questionId) ?? null,
      })),
    },
  };
}

async function loadWritableQuestion(userId: string, attemptId: string, questionId: string) {
  const attempt = await loadAttempt(userId, attemptId);
  if (!attempt) throw new AppError("Mock test attempt not found.");
  if (attempt.status !== "IN_PROGRESS") throw new AppError("This mock test has already been submitted.");
  const link = attempt.questions.find((q) => q.questionId === questionId);
  if (!link) throw new AppError("That question is not part of this attempt.");

  const timing = timingFor(attempt, new Date(Date.now() - GRACE_SECONDS * 1000));
  if (timing.status === "expired") throw new AppError("Time is up for this mock test.");
  if (attempt.sectionalTiming && link.sectionIndex !== timing.sectionIndex) {
    throw new AppError("That section's time is over or it has not started yet.");
  }
  return { attempt, link };
}

export async function saveMockAnswer(userId: string, attemptId: string, questionId: string, optionId: string | null) {
  const { link } = await loadWritableQuestion(userId, attemptId, questionId);
  const where = { mockAttemptId_questionId: { mockAttemptId: attemptId, questionId } };

  if (optionId === null) {
    await prisma.userAnswer.deleteMany({ where: { mockAttemptId: attemptId, questionId } });
    return;
  }

  const option = link.question.options.find((o) => o.id === optionId);
  if (!option) throw new AppError("That option does not belong to this question.");
  await prisma.userAnswer.upsert({
    where,
    create: {
      userId,
      mockAttemptId: attemptId,
      questionId,
      selectedOptionId: option.id,
      isCorrect: option.isCorrect,
      topicId: link.question.topicId,
      subjectId: link.question.subjectId,
      difficulty: link.question.difficulty,
    },
    update: { selectedOptionId: option.id, isCorrect: option.isCorrect, answeredAt: new Date() },
  });
}

export async function setMockQuestionFlags(
  userId: string,
  attemptId: string,
  questionId: string,
  flags: { markedForReview?: boolean; visited?: boolean },
) {
  await loadWritableQuestion(userId, attemptId, questionId);
  await prisma.mockAttemptQuestion.update({
    where: { attemptId_questionId: { attemptId, questionId } },
    data: flags,
  });
}

/** Ends the current section early. Later sections' timers start now. */
export async function advanceSection(userId: string, attemptId: string) {
  const attempt = await loadAttempt(userId, attemptId);
  if (!attempt) throw new AppError("Mock test attempt not found.");
  if (attempt.status !== "IN_PROGRESS") throw new AppError("This mock test has already been submitted.");
  if (!attempt.sectionalTiming) throw new AppError("This mock test does not have timed sections.");

  const indexes = sectionTimings(attempt).map((s) => s.index).sort((a, b) => a - b);
  const timing = timingFor(attempt, new Date());
  if (timing.status === "expired") {
    await submitAttempt(userId, attemptId, true);
    return { submitted: true };
  }
  const next = indexes.find((i) => i > timing.sectionIndex);
  if (next === undefined) {
    await submitAttempt(userId, attemptId, false);
    return { submitted: true };
  }
  await prisma.mockTestAttempt.update({
    where: { id: attemptId },
    data: { currentSectionIndex: next, sectionStartedAt: new Date() },
  });
  return { submitted: false };
}

export async function submitAttempt(userId: string, attemptId: string, autoSubmitted: boolean) {
  const attempt = await loadAttempt(userId, attemptId);
  if (!attempt) throw new AppError("Mock test attempt not found.");
  if (attempt.status === "SUBMITTED") return;

  const answers = new Map(attempt.answers.map((a) => [a.questionId, a]));
  const lines: ScoreLine[] = attempt.questions.map((q) => ({
    sectionName: q.sectionName,
    marksPerQuestion: q.marksPerQuestion,
    negativeMarks: q.negativeMarks,
    isCorrect: answers.get(q.questionId)?.isCorrect ?? null,
  }));
  const result = scoreAttempt(lines);

  const now = new Date();
  // Elapsed time is shared equally: the mock timer has no per-question clock.
  const elapsed = Math.min(attempt.totalSeconds, Math.round((now.getTime() - attempt.startedAt.getTime()) / 1000));
  const perAnswer = attempt.answers.length > 0 ? Math.round(elapsed / attempt.answers.length) : 0;

  await prisma.$transaction(async (tx) => {
    // The guarded update makes a double submit (timer and button) count only once.
    const claimed = await tx.mockTestAttempt.updateMany({
      where: { id: attemptId, status: "IN_PROGRESS" },
      data: {
        status: "SUBMITTED",
        submittedAt: now,
        autoSubmitted,
        score: result.score,
        maxScore: result.maxScore,
        correctCount: result.correct,
        incorrectCount: result.incorrect,
        unansweredCount: result.unanswered,
      },
    });
    if (claimed.count === 0) return;
    await tx.userAnswer.updateMany({
      where: { mockAttemptId: attemptId },
      data: { finalizedAt: now, timeSpentSec: perAnswer },
    });
    await applyFinalizedAnswers(
      tx,
      userId,
      attempt.answers.map((a) => ({
        questionId: a.questionId,
        selectedOptionId: a.selectedOptionId,
        isCorrect: a.isCorrect,
        timeSpentSec: perAnswer,
      })),
      now,
    );
  });
}

export type MockResultItem = Omit<MockAttemptItem, "visited"> & {
  reveal: Reveal;
  isCorrect: boolean | null;
};

export async function getAttemptResult(userId: string, attemptId: string) {
  const attempt = await loadAttempt(userId, attemptId);
  if (!attempt || attempt.status !== "SUBMITTED") return null;

  const answers = new Map(attempt.answers.map((a) => [a.questionId, a]));
  const summary = scoreAttempt(
    attempt.questions.map((q) => ({
      sectionName: q.sectionName,
      marksPerQuestion: q.marksPerQuestion,
      negativeMarks: q.negativeMarks,
      isCorrect: answers.get(q.questionId)?.isCorrect ?? null,
    })),
  );
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId, questionId: { in: attempt.questions.map((q) => q.questionId) } },
    select: { questionId: true },
  });

  return {
    id: attempt.id,
    title: attempt.mockTest.title,
    examName: attempt.mockTest.exam.name,
    autoSubmitted: attempt.autoSubmitted,
    requestedCount: attempt.requestedCount,
    servedCount: attempt.servedCount,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
    summary,
    bookmarkedIds: bookmarks.map((b) => b.questionId),
    items: attempt.questions.map((q): MockResultItem => {
      const answer = answers.get(q.questionId);
      return {
        question: toClientQuestion(q.question),
        order: q.order,
        sectionIndex: q.sectionIndex,
        sectionName: q.sectionName,
        marksPerQuestion: q.marksPerQuestion,
        negativeMarks: q.negativeMarks,
        markedForReview: q.markedForReview,
        selectedOptionId: answer?.selectedOptionId ?? null,
        isCorrect: answer ? answer.isCorrect : null,
        reveal: toReveal(q.question),
      };
    }),
  };
}
