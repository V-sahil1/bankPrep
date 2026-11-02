import { Target } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/app/common";
import { PracticeHub } from "@/features/practice/practice-hub";
import { prisma } from "@/lib/prisma";
import { requireUserPage } from "@/lib/session";
import { getTopicSolvedCounts, getTopicStats } from "@/services/analytics";
import { getPracticeCatalog, getTopicAvailability } from "@/services/practice";

export const metadata = { title: "Practice Questions" };

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string; subject?: string; topic?: string; q?: string }>;
}) {
  const user = await requireUserPage();
  const params = await searchParams;
  const catalog = await getPracticeCatalog();

  if (catalog.exams.length === 0) {
    return (
      <>
        <PageHeader title="Practice Questions" />
        <EmptyState icon={Target} title="No examinations yet" description="An administrator needs to add an exam before you can practise." />
      </>
    );
  }

  const [common, topicStats, solved, active, ...perExam] = await Promise.all([
    getTopicAvailability(null),
    getTopicStats(user.id),
    getTopicSolvedCounts(user.id),
    prisma.practiceSession.findFirst({
      where: { userId: user.id, status: "IN_PROGRESS" },
      orderBy: { startedAt: "desc" },
      include: { topic: { select: { name: true } }, exam: { select: { name: true } }, _count: { select: { answers: true } } },
    }),
    ...catalog.exams.map((exam) => getTopicAvailability(exam.id)),
  ]);

  return (
    <PracticeHub
      catalog={catalog}
      commonAvailability={common}
      availabilityByExam={Object.fromEntries(catalog.exams.map((exam, i) => [exam.id, perExam[i]]))}
      topicStats={Object.fromEntries(topicStats.map((t) => [t.topicId, { attempted: t.attempted, correct: t.correct, accuracy: t.accuracy }]))}
      solved={solved}
      resume={
        active
          ? {
              sessionId: active.id,
              topicName: active.topic?.name ?? "Practice session",
              examName: active.exam?.name ?? null,
              answered: active._count.answers,
              total: active.questionCount,
            }
          : null
      }
      initial={{ examSlug: params.exam, subjectId: params.subject, topicId: params.topic, q: params.q }}
      preferredExamId={user.preferredExamId}
    />
  );
}
