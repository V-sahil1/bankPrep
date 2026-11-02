"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DifficultyBadge, QuestionBody, ReviewOptions, SourceBadge } from "@/components/app/question-parts";
import { startListSessionAction } from "@/features/practice/actions";
import { useAction } from "@/hooks/use-action";
import { formatDate } from "@/lib/dates";
import type { MistakeEntry } from "@/services/notebook";

type Filter = "open" | "resolved" | "all";

export function MistakesView({ mistakes }: { mistakes: MistakeEntry[] }) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [filter, setFilter] = useState<Filter>("open");

  const open = mistakes.filter((m) => !m.isResolved);
  const resolved = mistakes.filter((m) => m.isResolved);
  const visible = filter === "open" ? open : filter === "resolved" ? resolved : mistakes;

  function retry(questionId?: string) {
    run(() => startListSessionAction({ source: "MISTAKES", questionId }), {
      onSuccess: ({ sessionId }) => router.push(`/practice/session/${sessionId}`),
    });
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Filter mistakes" className="flex flex-wrap gap-1.5">
          {(
            [
              ["open", `To fix (${open.length})`],
              ["resolved", `Fixed (${resolved.length})`],
              ["all", `All (${mistakes.length})`],
            ] as const
          ).map(([value, label]) => (
            <Button key={value} size="sm" variant={filter === value ? "secondary" : "ghost"} aria-pressed={filter === value} onClick={() => setFilter(value)}>
              {label}
            </Button>
          ))}
        </div>
        <Button onClick={() => retry()} disabled={pending || open.length === 0}>
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <RotateCcw aria-hidden />}
          Retry all {open.length}
        </Button>
      </div>

      {visible.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {filter === "open" ? "Nothing left to fix. Well done." : "Nothing here yet."}
        </p>
      )}

      <ul className="space-y-4">
        {visible.map((mistake) => (
          <li key={mistake.id} className="rounded-xl border bg-card p-5 shadow-soft">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {mistake.question.subjectName} · {mistake.question.topicName}
              </span>
              <DifficultyBadge difficulty={mistake.question.difficulty} />
              <SourceBadge sourceType={mistake.question.sourceType} pyqVerified={mistake.question.pyqVerified} reference={mistake.question.sourceReference} />
              {mistake.isResolved && (
                <span className="flex items-center gap-1 text-xs font-medium text-success">
                  <CheckCircle2 className="size-3.5" aria-hidden /> Fixed on retry
                </span>
              )}
              <Button variant="outline" size="sm" className="ml-auto" disabled={pending} onClick={() => retry(mistake.questionId)}>
                <RotateCcw aria-hidden /> Retry
              </Button>
            </div>
            <QuestionBody question={mistake.question} />
            <div className="mt-4">
              <ReviewOptions
                options={mistake.question.options}
                correctOptionId={mistake.reveal.correctOptionId}
                selectedOptionId={mistake.lastWrongOptionId}
              />
            </div>
            <p className="mt-4 rounded-lg bg-muted/50 p-4 text-sm leading-relaxed whitespace-pre-line">{mistake.reveal.explanation}</p>
            <p className="mt-3 text-xs text-muted-foreground tabular-nums">
              Wrong {mistake.wrongCount} {mistake.wrongCount === 1 ? "time" : "times"} · Correct on retry {mistake.correctRetryCount}{" "}
              {mistake.correctRetryCount === 1 ? "time" : "times"} · Last wrong {formatDate(mistake.lastWrongAt)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
