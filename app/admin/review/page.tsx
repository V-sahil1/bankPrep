import { ShieldCheck } from "lucide-react";
import { EmptyState, LinkButton, PageHeader } from "@/components/app/common";
import { ReviewQueue } from "@/features/admin/review-queue";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "AI Review" };

export default async function ReviewPage() {
  const questions = await prisma.question.findMany({
    where: { status: "PENDING_REVIEW" },
    orderBy: { createdAt: "asc" },
    take: 100,
    include: {
      options: { orderBy: { order: "asc" } },
      topic: { select: { name: true } },
      exam: { select: { shortName: true } },
    },
  });
  return (
    <>
      <PageHeader title="AI Review" description="Check each generated question and its answer. Learners only see what you approve." />
      {questions.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Nothing to review"
          description="Generated questions will wait here for your approval."
          action={<LinkButton href="/admin/ai">Generate questions</LinkButton>}
        />
      ) : (
        <ReviewQueue
          questions={questions.map((q) => ({
            id: q.id,
            questionText: q.questionText,
            explanation: q.explanation,
            difficulty: q.difficulty,
            tags: q.tags,
            examName: q.exam.shortName,
            topicName: q.topic.name,
            options: q.options.map((o) => ({ id: o.id, text: o.text, isCorrect: o.isCorrect })),
          }))}
        />
      )}
    </>
  );
}
