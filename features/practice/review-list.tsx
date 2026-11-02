"use client";

import { useState } from "react";
import { Bookmark, CheckCircle2, CircleSlash, TriangleAlert, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DifficultyBadge, QuestionBody, ReviewOptions, SourceBadge } from "@/components/app/question-parts";
import { toggleBookmarkAction } from "@/features/practice/actions";
import { ReportDialog } from "@/features/practice/report-dialog";
import { useAction } from "@/hooks/use-action";
import { cn } from "@/lib/utils";
import type { ClientQuestion } from "@/services/question-view";

export type ReviewItem = {
  question: ClientQuestion;
  selectedOptionId: string | null;
  isCorrect: boolean | null;
  correctOptionId: string | null;
  explanation: string;
  meta?: string;
};

type Filter = "all" | "wrong" | "correct" | "skipped";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "wrong", label: "Incorrect" },
  { value: "correct", label: "Correct" },
  { value: "skipped", label: "Skipped" },
];

/** The question-by-question solutions shown after a session or mock test. */
export function ReviewList({ items, bookmarkedIds }: { items: ReviewItem[]; bookmarkedIds: string[] }) {
  const { pending, run } = useAction();
  const [filter, setFilter] = useState<Filter>("all");
  const [bookmarks, setBookmarks] = useState(() => new Set(bookmarkedIds));
  const [reporting, setReporting] = useState<string | null>(null);

  const visible = items
    .map((item, i) => ({ item, number: i + 1 }))
    .filter(({ item }) => {
      if (filter === "wrong") return item.isCorrect === false;
      if (filter === "correct") return item.isCorrect === true;
      if (filter === "skipped") return item.isCorrect === null;
      return true;
    });

  function toggle(questionId: string) {
    run(() => toggleBookmarkAction(questionId), {
      onSuccess: (on) => {
        setBookmarks((current) => {
          const next = new Set(current);
          if (on) next.add(questionId);
          else next.delete(questionId);
          return next;
        });
        toast.success(on ? "Bookmarked." : "Bookmark removed.");
      },
    });
  }

  return (
    <div>
      <div role="group" aria-label="Filter solutions" className="mb-4 flex flex-wrap gap-1.5">
        {FILTERS.map(({ value, label }) => (
          <Button
            key={value}
            size="sm"
            variant={filter === value ? "secondary" : "ghost"}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {visible.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No questions in this view.</p>}

      <ol className="space-y-4">
        {visible.map(({ item, number }) => (
          <li key={item.question.id} className="rounded-xl border bg-card p-5 shadow-soft">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold tabular-nums">Q{number}</span>
              {item.isCorrect === true && (
                <span className="flex items-center gap-1 text-xs font-medium text-success">
                  <CheckCircle2 className="size-3.5" aria-hidden /> Correct
                </span>
              )}
              {item.isCorrect === false && (
                <span className="flex items-center gap-1 text-xs font-medium text-danger">
                  <XCircle className="size-3.5" aria-hidden /> Incorrect
                </span>
              )}
              {item.isCorrect === null && (
                <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <CircleSlash className="size-3.5" aria-hidden /> Not answered
                </span>
              )}
              <DifficultyBadge difficulty={item.question.difficulty} />
              <SourceBadge
                sourceType={item.question.sourceType}
                pyqVerified={item.question.pyqVerified}
                reference={item.question.sourceReference}
              />
              {item.meta && <span className="text-xs text-muted-foreground">{item.meta}</span>}
              <div className="ml-auto flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={pending}
                  aria-pressed={bookmarks.has(item.question.id)}
                  aria-label={bookmarks.has(item.question.id) ? "Remove bookmark" : "Bookmark question"}
                  onClick={() => toggle(item.question.id)}
                  className={cn(bookmarks.has(item.question.id) && "text-primary")}
                >
                  <Bookmark className={cn(bookmarks.has(item.question.id) && "fill-current")} aria-hidden />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Report incorrect question" onClick={() => setReporting(item.question.id)}>
                  <TriangleAlert aria-hidden />
                </Button>
              </div>
            </div>
            <QuestionBody question={item.question} />
            <div className="mt-4">
              <ReviewOptions
                options={item.question.options}
                correctOptionId={item.correctOptionId}
                selectedOptionId={item.selectedOptionId}
              />
            </div>
            <div className="mt-4 rounded-lg bg-muted/50 p-4 text-sm leading-relaxed whitespace-pre-line">
              <span className="mb-1 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">Explanation</span>
              {item.explanation}
            </div>
          </li>
        ))}
      </ol>
      <ReportDialog
        questionId={reporting ?? ""}
        open={reporting !== null}
        onOpenChange={(open) => {
          if (!open) setReporting(null);
        }}
      />
    </div>
  );
}
