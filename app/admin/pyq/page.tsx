import { BadgeCheck } from "lucide-react";
import { EmptyState, LinkButton, PageHeader } from "@/components/app/common";
import { DifficultyBadge, ReviewOptions, SourceBadge } from "@/components/app/question-parts";
import { PyqVerifier } from "@/features/admin/pyq-verifier";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "PYQ Verification" };

export default async function PyqAdminPage() {
  const questions = await prisma.question.findMany({
    where: { sourceType: "PYQ" },
    orderBy: [{ pyqVerifiedAt: { sort: "asc", nulls: "first" } }, { createdAt: "desc" }],
    take: 100,
    include: {
      options: { orderBy: { order: "asc" } },
      topic: { select: { name: true } },
      exam: { select: { shortName: true } },
    },
  });

  return (
    <>
      <PageHeader
        title="PYQ Verification"
        description="A previous-year question reaches learners only after you check it against a named source."
        actions={<LinkButton href="/admin/questions/new">Add a PYQ</LinkButton>}
      />
      {questions.length === 0 ? (
        <EmptyState
          icon={BadgeCheck}
          title="No previous-year questions yet"
          description="Add one with the source type set to Previous year question, or include them in a bulk import with a source reference."
          action={<LinkButton href="/admin/import" variant="outline">Bulk import</LinkButton>}
        />
      ) : (
        <ul className="space-y-4">
          {questions.map((q) => (
            <li key={q.id} className="rounded-xl border bg-card p-5 shadow-soft">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">{q.exam.shortName} · {q.topic.name}</span>
                <DifficultyBadge difficulty={q.difficulty} />
                <SourceBadge sourceType="PYQ" pyqVerified={q.pyqVerifiedAt !== null} />
              </div>
              <p className="mb-3 text-sm font-medium whitespace-pre-line">{q.questionText}</p>
              <ReviewOptions options={q.options} correctOptionId={q.options.find((o) => o.isCorrect)?.id ?? null} selectedOptionId={null} />
              <div className="mt-4">
                <PyqVerifier questionId={q.id} reference={q.sourceReference ?? ""} verified={q.pyqVerifiedAt !== null} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
