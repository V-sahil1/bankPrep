import { notFound, redirect } from "next/navigation";
import { CheckCircle2, CircleSlash, Clock, Target, XCircle } from "lucide-react";
import { LinkButton, PageHeader, StatCard } from "@/components/app/common";
import { ReviewList } from "@/features/practice/review-list";
import { formatDuration } from "@/lib/dates";
import { requireUserPage } from "@/lib/session";
import { getSessionView } from "@/services/practice";

export const metadata = { title: "Session results" };

export default async function SessionResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUserPage();
  const { id } = await params;
  const session = await getSessionView(user.id, id);
  if (!session) notFound();
  if (session.status === "IN_PROGRESS") redirect(`/practice/session/${id}`);

  const attempted = session.correctCount + session.incorrectCount;
  const accuracy = attempted === 0 ? 0 : Math.round((session.correctCount / attempted) * 100);
  const skipped = session.items.length - attempted;
  const again = session.again
    ? `/practice?subject=${session.again.subjectId}&topic=${session.again.topicId}${session.again.examSlug ? `&exam=${session.again.examSlug}` : "&exam=all"}`
    : null;

  return (
    <>
      <PageHeader
        eyebrow={session.status === "ABANDONED" ? "Discarded session" : "Session complete"}
        title={`${session.title}: results`}
        description={session.subtitle}
        actions={
          <>
            {again && (
              <LinkButton href={again} variant="outline">
                Practise this topic again
              </LinkButton>
            )}
            <LinkButton href="/practice" variant="outline">
              Choose another topic
            </LinkButton>
            <LinkButton href="/mistakes">Review mistakes</LinkButton>
          </>
        }
      />
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Accuracy" value={attempted ? `${accuracy}%` : "–"} icon={Target} />
        <StatCard label="Correct" value={session.correctCount} icon={CheckCircle2} accent="success" />
        <StatCard label="Incorrect" value={session.incorrectCount} icon={XCircle} />
        <StatCard label="Skipped" value={skipped} icon={CircleSlash} />
        <StatCard label="Time spent" value={formatDuration(session.timeSpentSec)} icon={Clock} />
      </div>
      <h2 className="mb-3 text-xl font-semibold">Solutions</h2>
      <ReviewList
        bookmarkedIds={session.bookmarkedIds}
        items={session.items.map((item) => ({
          question: item.question,
          selectedOptionId: item.selectedOptionId,
          isCorrect: item.reveal?.isCorrect ?? null,
          correctOptionId: item.reveal?.correctOptionId ?? null,
          explanation: item.reveal?.explanation ?? "",
        }))}
      />
    </>
  );
}
