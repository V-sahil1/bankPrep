import { notFound, redirect } from "next/navigation";
import { CheckCircle2, CircleSlash, Timer, Trophy, XCircle } from "lucide-react";
import { LinkButton, PageHeader, Panel, PanelTitle, StatCard } from "@/components/app/common";
import { ReviewList } from "@/features/practice/review-list";
import { formatDuration } from "@/lib/dates";
import { requireUserPage } from "@/lib/session";
import { getAttemptResult } from "@/services/mock-tests";

export const metadata = { title: "Mock test results" };

export default async function MockResultPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUserPage();
  const { id } = await params;
  const result = await getAttemptResult(user.id, id);
  if (!result) {
    // Either it is someone else's attempt or it is still running; the attempt page sorts that out.
    redirect(`/mock-tests/attempt/${id}`);
  }
  if (!result.items.length) notFound();

  const { summary } = result;
  const seconds = result.submittedAt ? (result.submittedAt.getTime() - result.startedAt.getTime()) / 1000 : 0;

  return (
    <>
      <PageHeader
        title={`${result.title}: summary`}
        description={[result.examName, result.autoSubmitted ? "Submitted automatically when time ended" : null].filter(Boolean).join(" · ")}
        actions={<LinkButton href="/mock-tests" variant="outline">All mock tests</LinkButton>}
      />

      {result.servedCount < result.requestedCount && (
        <p className="mb-4 rounded-lg border border-warning/40 bg-warning-soft px-3 py-2 text-xs text-warning">
          This attempt had {result.servedCount} of the pattern&apos;s {result.requestedCount} questions because the bank was short, so the score is out of a smaller total.
        </p>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Score" value={`${summary.score} / ${summary.maxScore}`} icon={Trophy} />
        <StatCard label="Correct" value={summary.correct} icon={CheckCircle2} />
        <StatCard label="Incorrect" value={summary.incorrect} icon={XCircle} />
        <StatCard label="Unanswered" value={summary.unanswered} icon={CircleSlash} />
        <StatCard label="Time used" value={formatDuration(seconds)} icon={Timer} />
      </div>

      <Panel className="mb-8">
        <PanelTitle>Section-wise score</PanelTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-md text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="py-1.5 text-left font-medium">Section</th>
                <th scope="col" className="py-1.5 text-right font-medium">Score</th>
                <th scope="col" className="py-1.5 text-right font-medium">Correct</th>
                <th scope="col" className="py-1.5 text-right font-medium">Incorrect</th>
                <th scope="col" className="py-1.5 text-right font-medium">Unanswered</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {summary.sections.map((section) => (
                <tr key={section.name} className="border-t">
                  <td className="py-2">{section.name}</td>
                  <td className="py-2 text-right font-medium">{section.score} / {section.maxScore}</td>
                  <td className="py-2 text-right">{section.correct}</td>
                  <td className="py-2 text-right">{section.incorrect}</td>
                  <td className="py-2 text-right">{section.unanswered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <h2 className="mb-3 text-base font-semibold">Detailed solutions</h2>
      <ReviewList
        bookmarkedIds={result.bookmarkedIds}
        items={result.items.map((item) => ({
          question: item.question,
          selectedOptionId: item.selectedOptionId,
          isCorrect: item.isCorrect,
          correctOptionId: item.reveal.correctOptionId,
          explanation: item.reveal.explanation,
          meta: item.sectionName,
        }))}
      />
    </>
  );
}
