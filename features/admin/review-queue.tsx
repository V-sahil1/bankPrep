"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmButton } from "@/components/app/confirm-button";
import { DifficultyBadge, ReviewOptions, SourceBadge } from "@/components/app/question-parts";
import { reviewQuestionsAction } from "@/features/admin/actions";
import { useAction } from "@/hooks/use-action";
import type { Difficulty } from "@prisma/client";

export type PendingQuestion = {
  id: string;
  questionText: string;
  explanation: string;
  difficulty: Difficulty;
  tags: string[];
  examName: string;
  topicName: string;
  options: { id: string; text: string; isCorrect: boolean }[];
};

export function ReviewQueue({ questions }: { questions: PendingQuestion[] }) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function decide(ids: string[], decision: "APPROVED" | "REJECTED") {
    run(() => reviewQuestionsAction({ ids, decision }), {
      success: decision === "APPROVED" ? "Approved. Learners can now see these." : "Rejected.",
      onSuccess: () => {
        setSelected(new Set());
        router.refresh();
      },
    });
  }

  const ids = [...selected];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="mr-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 accent-[var(--primary)]"
            checked={selected.size === questions.length}
            onChange={(e) => setSelected(new Set(e.target.checked ? questions.map((q) => q.id) : []))}
          />
          Select all ({questions.length})
        </label>
        <Button size="sm" disabled={pending || ids.length === 0} onClick={() => decide(ids, "APPROVED")}>
          <Check aria-hidden /> Approve {ids.length || ""}
        </Button>
        <ConfirmButton
          size="sm"
          variant="outline"
          disabled={pending || ids.length === 0}
          title={`Reject ${ids.length} question(s)?`}
          description="They stay in the bank as rejected and learners never see them."
          confirmLabel="Reject"
          onConfirm={() => decide(ids, "REJECTED")}
        >
          <X aria-hidden /> Reject {ids.length || ""}
        </ConfirmButton>
      </div>
      <ul className="space-y-4">
        {questions.map((question) => (
          <li key={question.id} className="rounded-xl border bg-card p-5 shadow-soft">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <input
                type="checkbox"
                aria-label="Select question"
                className="size-4 accent-[var(--primary)]"
                checked={selected.has(question.id)}
                onChange={(e) =>
                  setSelected((current) => {
                    const next = new Set(current);
                    if (e.target.checked) next.add(question.id);
                    else next.delete(question.id);
                    return next;
                  })
                }
              />
              <span className="text-xs font-medium text-muted-foreground">{question.examName} · {question.topicName}</span>
              <DifficultyBadge difficulty={question.difficulty} />
              <SourceBadge sourceType="AI_GENERATED" />
              <span className="ml-auto flex gap-1">
                <Link href={`/admin/questions/${question.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  <Pencil aria-hidden /> Edit
                </Link>
                <Button size="sm" variant="ghost" disabled={pending} onClick={() => decide([question.id], "REJECTED")}>
                  <X aria-hidden /> Reject
                </Button>
                <Button size="sm" variant="outline" disabled={pending} onClick={() => decide([question.id], "APPROVED")}>
                  <Check aria-hidden /> Approve
                </Button>
              </span>
            </div>
            <p className="mb-3 text-sm font-medium whitespace-pre-line">{question.questionText}</p>
            <ReviewOptions
              options={question.options}
              correctOptionId={question.options.find((o) => o.isCorrect)?.id ?? null}
              selectedOptionId={null}
            />
            <p className="mt-3 rounded-lg bg-muted/50 p-3 text-sm whitespace-pre-line">{question.explanation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
