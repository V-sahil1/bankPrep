import type { Difficulty } from "@prisma/client";
import { addDays, computeStreak, dayDate, dbDateKey, weekStart } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { servableWhere } from "@/services/question-view";

export const WEAK_TOPIC_MIN_ATTEMPTS = 3;
export const WEAK_TOPIC_ACCURACY = 60;

export const percent = (part: number, whole: number) => (whole === 0 ? 0 : Math.round((part / whole) * 100));

type Tally = { attempted: number; correct: number };

function tally<K extends string>(rows: { key: K; isCorrect: boolean; count: number }[]) {
  const totals = new Map<K, Tally>();
  for (const row of rows) {
    const entry = totals.get(row.key) ?? { attempted: 0, correct: 0 };
    entry.attempted += row.count;
    if (row.isCorrect) entry.correct += row.count;
    totals.set(row.key, entry);
  }
  return totals;
}

export type TopicStat = {
  topicId: string;
  topicName: string;
  subjectId: string;
  subjectName: string;
  attempted: number;
  correct: number;
  accuracy: number;
};

export async function getTopicStats(userId: string): Promise<TopicStat[]> {
  const rows = await prisma.userAnswer.groupBy({
    by: ["topicId", "isCorrect"],
    where: { userId, finalizedAt: { not: null } },
    _count: { _all: true },
  });
  const totals = tally(rows.map((r) => ({ key: r.topicId, isCorrect: r.isCorrect, count: r._count._all })));
  const topics = await prisma.topic.findMany({
    where: { id: { in: [...totals.keys()] } },
    select: { id: true, name: true, subjectId: true, subject: { select: { name: true, order: true } }, order: true },
    orderBy: [{ subject: { order: "asc" } }, { order: "asc" }],
  });
  return topics.map((topic) => {
    const t = totals.get(topic.id)!;
    return {
      topicId: topic.id,
      topicName: topic.name,
      subjectId: topic.subjectId,
      subjectName: topic.subject.name,
      attempted: t.attempted,
      correct: t.correct,
      accuracy: percent(t.correct, t.attempted),
    };
  });
}

/** Topics with enough attempts to judge and accuracy below the bar, worst first. */
export function findWeakTopics(stats: TopicStat[]): TopicStat[] {
  return stats
    .filter((s) => s.attempted >= WEAK_TOPIC_MIN_ATTEMPTS && s.accuracy < WEAK_TOPIC_ACCURACY)
    .sort((a, b) => a.accuracy - b.accuracy || b.attempted - a.attempted);
}

export async function getAnalytics(userId: string) {
  const [overall, timeAggregate, subjectRows, difficultyRows, topicStats, activity] = await Promise.all([
    prisma.userAnswer.groupBy({
      by: ["isCorrect"],
      where: { userId, finalizedAt: { not: null } },
      _count: { _all: true },
    }),
    prisma.userAnswer.aggregate({
      where: { userId, finalizedAt: { not: null } },
      _avg: { timeSpentSec: true },
    }),
    prisma.userAnswer.groupBy({
      by: ["subjectId", "isCorrect"],
      where: { userId, finalizedAt: { not: null } },
      _count: { _all: true },
    }),
    prisma.userAnswer.groupBy({
      by: ["difficulty", "isCorrect"],
      where: { userId, finalizedAt: { not: null } },
      _count: { _all: true },
    }),
    getTopicStats(userId),
    prisma.dailyActivity.findMany({
      where: { userId, date: { gte: addDays(dayDate(), -400) } },
      orderBy: { date: "asc" },
    }),
  ]);

  const correct = overall.find((r) => r.isCorrect)?._count._all ?? 0;
  const incorrect = overall.find((r) => !r.isCorrect)?._count._all ?? 0;
  const attempted = correct + incorrect;

  const subjectTotals = tally(subjectRows.map((r) => ({ key: r.subjectId, isCorrect: r.isCorrect, count: r._count._all })));
  const subjects = await prisma.subject.findMany({
    where: { id: { in: [...subjectTotals.keys()] } },
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  const difficultyTotals = tally(difficultyRows.map((r) => ({ key: r.difficulty, isCorrect: r.isCorrect, count: r._count._all })));
  const difficulties: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

  const today = dayDate();
  const byDay = new Map(activity.map((a) => [dbDateKey(a.date), a]));

  const daily = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(today, i - 29);
    const row = byDay.get(dbDateKey(date));
    return { date: dbDateKey(date), attempted: row?.attempted ?? 0, correct: row?.correct ?? 0 };
  });

  const thisWeek = weekStart(today);
  const weekly = Array.from({ length: 12 }, (_, i) => {
    const start = addDays(thisWeek, (i - 11) * 7);
    const days = Array.from({ length: 7 }, (_, d) => byDay.get(dbDateKey(addDays(start, d))));
    const weekAttempted = days.reduce((sum, d) => sum + (d?.attempted ?? 0), 0);
    const weekCorrect = days.reduce((sum, d) => sum + (d?.correct ?? 0), 0);
    return {
      week: dbDateKey(start),
      attempted: weekAttempted,
      accuracy: weekAttempted > 0 ? percent(weekCorrect, weekAttempted) : null,
    };
  });

  const monthly = Array.from({ length: 6 }, (_, i) => {
    const first = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - (5 - i), 1));
    const key = dbDateKey(first).slice(0, 7);
    const rows = activity.filter((a) => dbDateKey(a.date).startsWith(key));
    const monthAttempted = rows.reduce((sum, r) => sum + r.attempted, 0);
    const monthCorrect = rows.reduce((sum, r) => sum + r.correct, 0);
    return {
      month: key,
      attempted: monthAttempted,
      accuracy: monthAttempted > 0 ? percent(monthCorrect, monthAttempted) : null,
    };
  });

  return {
    attempted,
    correct,
    incorrect,
    accuracy: percent(correct, attempted),
    avgTimeSec: Math.round(timeAggregate._avg.timeSpentSec ?? 0),
    subjects: subjects.map((subject) => {
      const t = subjectTotals.get(subject.id)!;
      return { id: subject.id, name: subject.name, attempted: t.attempted, correct: t.correct, accuracy: percent(t.correct, t.attempted) };
    }),
    difficulties: difficulties.map((difficulty) => {
      const t = difficultyTotals.get(difficulty) ?? { attempted: 0, correct: 0 };
      return { difficulty, attempted: t.attempted, correct: t.correct, accuracy: percent(t.correct, t.attempted) };
    }),
    topics: topicStats,
    weakTopics: findWeakTopics(topicStats),
    daily,
    weekly,
    monthly,
  };
}

export type AnalyticsData = Awaited<ReturnType<typeof getAnalytics>>;

/** The numbers the app shell shows on every page. */
export async function getShellStats(userId: string) {
  const today = dayDate();
  const [todayActivity, activeDays, dueMistakes, exams] = await Promise.all([
    prisma.dailyActivity.findUnique({ where: { userId_date: { userId, date: today } } }),
    prisma.dailyActivity.findMany({
      where: { userId, attempted: { gt: 0 } },
      select: { date: true },
      orderBy: { date: "desc" },
      take: 400,
    }),
    prisma.mistake.count({ where: { userId, isResolved: false } }),
    prisma.exam.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { id: true, slug: true, name: true, shortName: true },
    }),
  ]);
  return {
    todayAttempted: todayActivity?.attempted ?? 0,
    streak: computeStreak(activeDays.map((d) => dbDateKey(d.date)), today),
    dueMistakes,
    exams,
  };
}

export type ShellStats = Awaited<ReturnType<typeof getShellStats>>;

/** How many distinct questions the user has answered per topic. */
export async function getTopicSolvedCounts(userId: string): Promise<Record<string, number>> {
  const rows = await prisma.userAnswer.findMany({
    where: { userId, finalizedAt: { not: null } },
    select: { topicId: true, questionId: true },
    distinct: ["topicId", "questionId"],
  });
  const counts: Record<string, number> = {};
  for (const row of rows) counts[row.topicId] = (counts[row.topicId] ?? 0) + 1;
  return counts;
}

export async function getDashboard(userId: string, preferredExamId: string | null, dailyTarget: number) {
  const today = dayDate();
  const [todayActivity, activeDays, overall, recentSessions, activeSessions, topicStats, exams, recentMocks, mockSummary, counts] =
    await Promise.all([
    prisma.dailyActivity.findUnique({ where: { userId_date: { userId, date: today } } }),
    prisma.dailyActivity.findMany({
      where: { userId, attempted: { gt: 0 } },
      select: { date: true },
      orderBy: { date: "desc" },
      take: 400,
    }),
    prisma.userAnswer.groupBy({
      by: ["isCorrect"],
      where: { userId, finalizedAt: { not: null } },
      _count: { _all: true },
    }),
    prisma.practiceSession.findMany({
      where: { userId, status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
      take: 5,
      include: { topic: { select: { name: true } }, exam: { select: { shortName: true } } },
    }),
    prisma.practiceSession.findMany({
      where: { userId, status: "IN_PROGRESS" },
      orderBy: { startedAt: "desc" },
      take: 3,
      include: {
        topic: { select: { name: true } },
        exam: { select: { shortName: true } },
        _count: { select: { answers: true } },
      },
    }),
    getTopicStats(userId),
    prisma.exam.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { id: true, slug: true, name: true, shortName: true, description: true },
    }),
    prisma.mockTestAttempt.findMany({
      where: { userId, status: "SUBMITTED" },
      orderBy: { submittedAt: "desc" },
      take: 5,
      include: { mockTest: { select: { title: true, exam: { select: { shortName: true } } } } },
    }),
    prisma.mockTestAttempt.aggregate({
      where: { userId, status: "SUBMITTED" },
      _count: { _all: true },
      _max: { score: true },
    }),
    Promise.all([
      prisma.mockTest.count({ where: { isActive: true, exam: { isActive: true } } }),
      prisma.mistake.count({ where: { userId, isResolved: false } }),
      prisma.question.count({ where: { sourceType: "PYQ", status: "APPROVED", pyqVerifiedAt: { not: null } } }),
      prisma.topic.count({ where: { questions: { some: servableWhere } } }),
    ]),
  ]);

  const correct = overall.find((r) => r.isCorrect)?._count._all ?? 0;
  const incorrect = overall.find((r) => !r.isCorrect)?._count._all ?? 0;
  const weakTopics = findWeakTopics(topicStats).slice(0, 5);

  // Per exam: what the bank offers and how the user has done in sessions for it.
  const examCards = await Promise.all(
    exams.map(async (exam) => {
      const [available, answers] = await Promise.all([
        prisma.questionExam.count({ where: { examId: exam.id, question: servableWhere } }),
        prisma.userAnswer.groupBy({
          by: ["isCorrect"],
          where: { userId, finalizedAt: { not: null }, session: { examId: exam.id } },
          _count: { _all: true },
        }),
      ]);
      const examCorrect = answers.find((r) => r.isCorrect)?._count._all ?? 0;
      const examAttempted = answers.reduce((sum, r) => sum + r._count._all, 0);
      return { ...exam, available, attempted: examAttempted, accuracy: percent(examCorrect, examAttempted) };
    }),
  );

  const activity = [
    ...recentSessions.map((s) => ({
      kind: "session" as const,
      id: s.id,
      title: s.topic?.name ?? "Practice session",
      meta: s.exam?.shortName ?? null,
      at: s.completedAt ?? s.startedAt,
      score: `${s.correctCount}/${s.questionCount}`,
      accuracy: percent(s.correctCount, s.correctCount + s.incorrectCount),
      attempted: s.correctCount + s.incorrectCount,
      mode: s.mode,
    })),
    ...recentMocks.map((m) => ({
      kind: "mock" as const,
      id: m.id,
      title: m.mockTest.title,
      meta: m.mockTest.exam.shortName,
      at: m.submittedAt ?? m.startedAt,
      score: `${m.score ?? 0}/${m.maxScore ?? 0}`,
      accuracy: percent(m.correctCount ?? 0, (m.correctCount ?? 0) + (m.incorrectCount ?? 0)),
      attempted: (m.correctCount ?? 0) + (m.incorrectCount ?? 0),
      mode: "MOCK" as const,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 5);

  // Recommend weak topics first, then topics the user has never touched that
  // actually have questions for their exam.
  const attemptedIds = new Set(topicStats.map((t) => t.topicId));
  const examFilter = preferredExamId ?? exams[0]?.id;
  const fresh = examFilter
    ? await prisma.examTopic.findMany({
        where: {
          examId: examFilter,
          isActive: true,
          topicId: { notIn: [...attemptedIds] },
          topic: { questions: { some: { AND: [servableWhere, { relevantExams: { some: { examId: examFilter } } }] } } },
        },
        take: 4,
        orderBy: { order: "asc" },
        select: { topic: { select: { id: true, name: true, subject: { select: { id: true, name: true } } } } },
      })
    : [];

  const [mockCount, dueMistakes, verifiedPyq, topicsWithQuestions] = counts;

  return {
    dailyTarget,
    todayAttempted: todayActivity?.attempted ?? 0,
    todayCorrect: todayActivity?.correct ?? 0,
    todayTimeSec: todayActivity?.timeSpentSec ?? 0,
    streak: computeStreak(activeDays.map((d) => dbDateKey(d.date)), today),
    attempted: correct + incorrect,
    accuracy: percent(correct, correct + incorrect),
    mocksCompleted: mockSummary._count._all,
    bestMockScore: mockSummary._max.score,
    recentSessions,
    activity,
    activeSessions,
    weakTopics,
    recommendedTopics: fresh.map((f) => f.topic),
    recommendedExamId: examFilter ?? null,
    exams: examCards,
    workspace: { mockCount, dueMistakes, verifiedPyq, topicsWithQuestions },
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboard>>;

export async function getHistory(userId: string) {
  const [sessions, attempts] = await Promise.all([
    prisma.practiceSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 100,
      include: { topic: { select: { name: true } }, exam: { select: { shortName: true } }, subject: { select: { name: true } } },
    }),
    prisma.mockTestAttempt.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 50,
      include: { mockTest: { select: { title: true, exam: { select: { shortName: true } } } } },
    }),
  ]);
  return { sessions, attempts };
}
