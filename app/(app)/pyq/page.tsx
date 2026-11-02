import { BadgeCheck, FileQuestion } from "lucide-react";
import { EmptyState, LinkButton, PageHeader, Panel } from "@/components/app/common";
import { StartPyqButton } from "@/features/question-bank/start-pyq-button";
import { requireUserPage } from "@/lib/session";
import { getVerifiedPyqSummary } from "@/services/notebook";

export const metadata = { title: "Previous Year Questions" };

export default async function PyqPage() {
  const user = await requireUserPage();
  const summary = await getVerifiedPyqSummary();

  return (
    <>
      <PageHeader
        title="Previous Year Questions"
        description="Only questions an administrator has checked against a named source appear here. Practice and AI-generated questions never do."
      />
      {summary.length === 0 ? (
        <EmptyState
          icon={FileQuestion}
          title="No verified previous-year questions yet"
          description="BankPrep does not ship invented PYQs. This list fills up as administrators add real questions and verify their sources. Until then, use topic-wise practice."
          action={
            user.role === "ADMIN" ? (
              <LinkButton href="/admin/pyq">Add and verify PYQs</LinkButton>
            ) : (
              <LinkButton href="/practice">Go to topic-wise practice</LinkButton>
            )
          }
        />
      ) : (
        <div className="space-y-6">
          {summary.map((exam) => (
            <Panel key={exam.examId}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <BadgeCheck className="size-4 text-primary" aria-hidden /> {exam.examName}
                  <span className="font-normal text-muted-foreground">{exam.total} verified</span>
                </h2>
                <StartPyqButton examId={exam.examId} label="Practise all" />
              </div>
              <ul className="divide-y">
                {exam.topics.map((topic) => (
                  <li key={topic.topicId} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span>
                      {topic.name} <span className="text-muted-foreground tabular-nums">({topic.count})</span>
                    </span>
                    <StartPyqButton examId={exam.examId} topicId={topic.topicId} label="Practise" />
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
