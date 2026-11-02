"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Flag,
  Keyboard,
  Lightbulb,
  Loader2,
  SkipForward,
  TriangleAlert,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/app/common";
import { ConfirmButton } from "@/components/app/confirm-button";
import { DifficultyBadge, OPTION_LETTERS, QuestionBody, SourceBadge } from "@/components/app/question-parts";
import { ReportDialog } from "@/features/practice/report-dialog";
import {
  abandonSessionAction,
  finishSessionAction,
  revealQuestionAction,
  saveSessionPositionAction,
  skipQuestionAction,
  submitAnswerAction,
  toggleBookmarkAction,
  toggleReviewAction,
} from "@/features/practice/actions";
import { useRunnerStore } from "@/features/practice/store";
import { useAction } from "@/hooks/use-action";
import { formatClock, formatDuration } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { SessionView } from "@/services/practice";

function useElapsed(startedAt: Date) {
  const [elapsed, setElapsed] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [startedAt]);
  return elapsed;
}

export function SessionRunner({ session }: { session: SessionView }) {
  const router = useRouter();
  const { pending, run } = useAction();
  const store = useRunnerStore();
  const [solutionOpen, setSolutionOpen] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const questionStartedAt = useRef(0);
  const [timeTaken, setTimeTaken] = useState<Record<string, number>>({});
  const elapsed = useElapsed(session.startedAt);

  const { init } = store;
  useEffect(() => {
    init(session);
    // Only re-seed when a different session is opened; afterwards the store leads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.id, init]);

  const ready = store.sessionId === session.id;
  const isTest = session.mode === "TEST";
  const index = ready ? store.index : Math.min(session.currentIndex, session.items.length - 1);
  const current = session.items[index];
  const questionId = current.question.id;
  const item = ready ? store.items[questionId] : undefined;

  const items = ready ? Object.values(store.items) : [];
  const answeredCount = items.filter((i) => i.selectedOptionId).length;
  const correctCount = items.filter((i) => i.isCorrect === true).length;
  const markedCount = items.filter((i) => i.markedForReview).length;
  const locked = !isTest && Boolean(item?.selectedOptionId || item?.explanation);
  const correctId = item?.correctOptionId ?? null;
  const correctLetter = correctId ? OPTION_LETTERS[current.question.options.findIndex((o) => o.id === correctId)] : null;

  const navigate = useCallback(
    (next: number) => {
      if (next < 0 || next >= session.items.length) return;
      useRunnerStore.getState().goTo(next);
      setSolutionOpen(true);
      // Best effort: resuming at a slightly older position costs the user nothing.
      void saveSessionPositionAction({ sessionId: session.id, index: next }).catch(() => undefined);
    },
    [session.id, session.items.length],
  );

  useEffect(() => {
    questionStartedAt.current = Date.now();
  }, [questionId]);

  function submit() {
    const optionId = item?.draftOptionId;
    if (!optionId) {
      toast.error("Select an option first.");
      return;
    }
    const timeSpentSec = Math.min(3600, Math.round((Date.now() - questionStartedAt.current) / 1000));
    run(() => submitAnswerAction({ sessionId: session.id, questionId, optionId, timeSpentSec }), {
      onSuccess: (result) => {
        setTimeTaken((all) => ({ ...all, [questionId]: timeSpentSec }));
        useRunnerStore.getState().applySubmit(questionId, optionId, result);
        questionStartedAt.current = Date.now();
        if (result.mode === "TEST") {
          toast.success("Answer saved.");
          if (index < session.items.length - 1) navigate(index + 1);
        }
      },
    });
  }

  function skip() {
    run(() => skipQuestionAction({ sessionId: session.id, questionId }), {
      onSuccess: () => {
        if (!item?.selectedOptionId) useRunnerStore.getState().setSkipped(questionId);
        if (index < session.items.length - 1) navigate(index + 1);
      },
    });
  }

  function toggleReview() {
    run(() => toggleReviewAction({ sessionId: session.id, questionId }), {
      onSuccess: (marked) => useRunnerStore.getState().setMarked(questionId, marked),
    });
  }

  function toggleBookmark() {
    run(() => toggleBookmarkAction(questionId), {
      onSuccess: (bookmarked) => {
        useRunnerStore.getState().setBookmarked(questionId, bookmarked);
        toast.success(bookmarked ? "Bookmarked." : "Bookmark removed.");
      },
    });
  }

  function reveal() {
    run(() => revealQuestionAction({ sessionId: session.id, questionId }), {
      onSuccess: ({ correctOptionId, explanation }) => {
        useRunnerStore.getState().applyReveal(questionId, correctOptionId, explanation);
        setSolutionOpen(true);
      },
    });
  }

  function finish() {
    run(() => finishSessionAction(session.id), {
      onSuccess: () => router.push(`/practice/session/${session.id}/results`),
    });
  }

  function abandon() {
    run(() => abandonSessionAction(session.id), {
      onSuccess: () => {
        toast.success("Session discarded.");
        router.push("/practice");
      },
    });
  }

  // Keyboard: 1-4 or A-D choose, Enter submits, arrows move, M marks for review.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey || reportOpen) return;
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, [role=dialog], [role=alertdialog]")) return;
      const key = event.key.toLowerCase();
      const choice = ["1", "2", "3", "4"].indexOf(key) >= 0 ? Number(key) - 1 : ["a", "b", "c", "d"].indexOf(key);

      if (key === "arrowright") navigate(useRunnerStore.getState().index + 1);
      else if (key === "arrowleft") navigate(useRunnerStore.getState().index - 1);
      else if (key === "m") document.getElementById("runner-mark")?.click();
      else if (key === "enter" && target.tagName !== "BUTTON") document.getElementById("runner-submit")?.click();
      else if (choice >= 0 && choice < current.question.options.length && !locked) {
        useRunnerStore.getState().draft(questionId, current.question.options[choice].id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current.question.options, locked, navigate, questionId, reportOpen]);

  const statusFor = (id: string) => {
    const state = ready ? store.items[id] : undefined;
    if (!state) return "bg-muted text-muted-foreground";
    if (state.isCorrect === true) return "bg-success-soft text-success ring-1 ring-success/40";
    if (state.isCorrect === false) return "bg-danger-soft text-danger ring-1 ring-danger/40";
    if (state.selectedOptionId) return "bg-primary text-primary-foreground";
    if (state.skipped) return "bg-warning-soft text-warning ring-1 ring-warning/40";
    return "bg-muted text-muted-foreground";
  };

  const isLast = index === session.items.length - 1;
  const bookmarked = ready && store.bookmarked[questionId];
  const marked = item?.markedForReview ?? false;
  const unanswered = session.items.length - answeredCount;
  const crumbs = session.subtitle.split(" · ").filter(Boolean);
  const taken = timeTaken[questionId];

  return (
    <div>
      <header className="mb-5 rounded-2xl border bg-card px-4 py-3 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm">
            {crumbs.map((crumb) => (
              <span key={crumb} className="flex items-center gap-1.5 text-muted-foreground">
                <span className="truncate">{crumb}</span>
                <ChevronRight className="size-3.5" aria-hidden />
              </span>
            ))}
            <h1 className="truncate font-sans text-sm font-semibold tracking-normal">{session.title}</h1>
          </nav>
          <div className="flex items-center gap-2">
            <span className="flex h-9 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-sm font-semibold tabular-nums" role="timer" aria-label="Session time">
              <Clock className="size-3.5 text-muted-foreground" aria-hidden />
              {elapsed === null ? "--:--" : formatClock(elapsed)}
            </span>
            <ConfirmButton
              variant="outline"
              size="sm"
              className="h-9"
              title="Discard this session?"
              description="Answers you already submitted in practice mode stay in your stats. Unsubmitted test answers are lost."
              confirmLabel="Discard session"
              onConfirm={abandon}
              disabled={pending}
            >
              Discard
            </ConfirmButton>
            <ConfirmButton
              size="sm"
              className="h-9"
              destructive={false}
              title="Finish this session?"
              description={unanswered > 0 ? `${unanswered} question(s) are unanswered and will be counted as skipped.` : "You have answered every question."}
              confirmLabel="Finish"
              onConfirm={finish}
              disabled={pending}
            >
              Finish
            </ConfirmButton>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <Chip tone="primary">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
            {isTest ? "Test mode · answers revealed at the end" : "Practice mode · live solutions"}
          </Chip>
          <p className="text-xs text-muted-foreground tabular-nums">
            Answered <span className="font-semibold text-foreground">{answeredCount}/{session.items.length}</span>
            {!isTest && answeredCount > 0 && (
              <>
                {" · "}Accuracy <span className="font-semibold text-primary">{Math.round((correctCount / answeredCount) * 100)}%</span>
              </>
            )}
          </p>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-5">
          <motion.article
            // No exit animation: an outgoing question's buttons must never take a click.
            key={questionId}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12 }}
            className="rounded-2xl border bg-card p-5 shadow-soft sm:p-6"
            aria-label={`Question ${index + 1} of ${session.items.length}`}
          >
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl bg-surface-2 px-3 py-2">
              <SourceBadge sourceType={current.question.sourceType} pyqVerified={current.question.pyqVerified} reference={current.question.sourceReference} />
              <DifficultyBadge difficulty={current.question.difficulty} />
              <span className="text-xs text-muted-foreground">
                Question <span className="font-semibold text-foreground tabular-nums">{index + 1}</span> of {session.items.length}
              </span>
              <div className="ml-auto flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleBookmark}
                  aria-pressed={Boolean(bookmarked)}
                  aria-label={bookmarked ? "Remove bookmark" : "Bookmark question"}
                  title={bookmarked ? "Remove bookmark" : "Bookmark question"}
                  disabled={pending}
                  className={cn(bookmarked && "text-primary")}
                >
                  <Bookmark className={cn(bookmarked && "fill-current")} aria-hidden />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setReportOpen(true)} aria-label="Report incorrect question" title="Report incorrect question">
                  <TriangleAlert aria-hidden />
                </Button>
              </div>
            </div>

            <QuestionBody question={current.question} />

            <div role="radiogroup" aria-label="Answer options" className="mt-5 space-y-2">
              {current.question.options.map((option, i) => {
                const selected = item?.draftOptionId === option.id;
                const isCorrect = locked && correctId === option.id;
                const isWrongPick = locked && item?.selectedOptionId === option.id && correctId !== option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={locked}
                    onClick={() => useRunnerStore.getState().draft(questionId, option.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
                      !locked && "hover:border-primary/50 hover:bg-surface-2",
                      selected && !locked && "border-primary bg-accent/60",
                      isCorrect && "border-success/60 bg-success-soft",
                      isWrongPick && "border-danger/60 bg-danger-soft",
                      locked && !isCorrect && !isWrongPick && "opacity-70",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-lg border font-heading text-xs font-semibold",
                        selected && !locked && "border-primary bg-primary text-primary-foreground",
                        isCorrect && "border-success bg-success text-card",
                        isWrongPick && "border-danger bg-danger text-card",
                      )}
                    >
                      {isCorrect ? <Check className="size-3.5" aria-hidden /> : isWrongPick ? <X className="size-3.5" aria-hidden /> : OPTION_LETTERS[i]}
                    </span>
                    <span className="min-w-0 flex-1 pt-1 whitespace-pre-line">{option.text}</span>
                    {isCorrect && <span className="sr-only">Correct answer</span>}
                    {isWrongPick && <span className="sr-only">Your answer, incorrect</span>}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" onClick={() => navigate(index - 1)} disabled={index === 0}>
                  <ArrowLeft aria-hidden /> Previous
                </Button>
                {!locked && (
                  <Button variant="ghost" onClick={() => useRunnerStore.getState().draft(questionId, null)} disabled={!item?.draftOptionId}>
                    Clear choice
                  </Button>
                )}
                {!locked && (
                  <Button variant="ghost" onClick={skip} disabled={pending}>
                    <SkipForward aria-hidden /> Skip
                  </Button>
                )}
                {!locked && !isTest && (
                  <ConfirmButton
                    variant="ghost"
                    destructive={false}
                    title="Show the explanation?"
                    description="This question will then be counted as skipped and can't be answered for credit in this session."
                    confirmLabel="Show explanation"
                    onConfirm={reveal}
                    disabled={pending}
                  >
                    <Lightbulb aria-hidden /> Show explanation
                  </ConfirmButton>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  id="runner-mark"
                  variant="secondary"
                  onClick={toggleReview}
                  aria-pressed={marked}
                  disabled={pending}
                  className={cn(marked && "bg-warning-soft text-warning hover:bg-warning-soft")}
                >
                  <Flag className={cn(marked && "fill-current")} aria-hidden />
                  {marked ? "Marked for review" : "Mark for review"}
                </Button>
                {!locked && (
                  <Button id="runner-submit" onClick={submit} disabled={pending || !item?.draftOptionId} className="h-10 rounded-xl px-5">
                    {pending && <Loader2 className="animate-spin" aria-hidden />}
                    {isTest ? (item?.selectedOptionId ? "Update answer" : "Save answer") : "Submit & view solution"}
                  </Button>
                )}
                {locked && !isLast && (
                  <Button onClick={() => navigate(index + 1)} className="h-10 rounded-xl px-5">
                    Next question <ArrowRight aria-hidden />
                  </Button>
                )}
                {locked && isLast && (
                  <Button onClick={finish} disabled={pending} className="h-10 rounded-xl px-5">
                    {pending && <Loader2 className="animate-spin" aria-hidden />} See results
                  </Button>
                )}
                {!locked && isTest && isLast && (
                  <Button variant="outline" onClick={finish} disabled={pending}>
                    Finish test
                  </Button>
                )}
              </div>
            </div>
          </motion.article>

          {locked && item?.explanation && (
            <section data-testid="solution" aria-live="polite" className="rounded-2xl border bg-card p-5 shadow-soft sm:p-6">
              <div
                className={cn(
                  "flex flex-wrap items-center gap-3 rounded-xl px-4 py-3",
                  item.isCorrect === true && "bg-success-soft",
                  item.isCorrect === false && "bg-danger-soft",
                  item.isCorrect === null && "bg-surface-2",
                )}
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full text-card",
                    item.isCorrect === true && "bg-success",
                    item.isCorrect === false && "bg-danger",
                    item.isCorrect === null && "bg-muted-foreground",
                  )}
                >
                  {item.isCorrect === false ? <X className="size-5" aria-hidden /> : item.isCorrect === true ? <Check className="size-5" aria-hidden /> : <Lightbulb className="size-5" aria-hidden />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                    {item.isCorrect === true && <span>Correct</span>}
                    {item.isCorrect === false && <span>Incorrect</span>}
                    {item.isCorrect === null && <span>Viewed without answering</span>}
                    {correctLetter && <span className="font-sans text-sm font-medium text-muted-foreground">Correct answer: Option {correctLetter}</span>}
                  </p>
                  {taken !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      You took <span className="font-semibold text-foreground">{formatDuration(taken)}</span> on this question.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSolutionOpen((open) => !open)}
                  aria-expanded={solutionOpen}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {solutionOpen ? "Hide solution" : "Show solution"}
                  <ChevronDown className={cn("size-4 transition-transform", solutionOpen && "rotate-180")} aria-hidden />
                </button>
              </div>
              {solutionOpen && (
                <div className="mt-4">
                  <p className="eyebrow mb-2">Explanation</p>
                  <p className="text-[15px] leading-relaxed whitespace-pre-line">{item.explanation}</p>
                  {current.question.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {current.question.tags.map((tag) => (
                        <Chip key={tag}>{tag}</Chip>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>

        <div className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <aside aria-label="Question palette" className="rounded-2xl border bg-card p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between border-b pb-2">
              <h2 className="text-base font-semibold">Question palette</h2>
              <Chip tone="primary">{session.items.length} total</Chip>
            </div>
            <ul className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              {!isTest ? (
                <>
                  <Legend className="bg-success-soft ring-1 ring-success/40" label={`Correct (${correctCount})`} />
                  <Legend className="bg-danger-soft ring-1 ring-danger/40" label={`Incorrect (${answeredCount - correctCount})`} />
                </>
              ) : (
                <Legend className="bg-primary" label={`Answered (${answeredCount})`} />
              )}
              <Legend className="bg-warning-soft ring-1 ring-warning/40" label="Skipped" />
              <Legend className="bg-muted" label={`Not attempted (${unanswered})`} />
              <Legend className="bg-card ring-1 ring-warning" label={`Marked (${markedCount})`} flag />
            </ul>
            <div className="grid grid-cols-8 gap-1.5 xl:grid-cols-6">
              {session.items.map((entry, i) => {
                const isMarked = ready && store.items[entry.question.id]?.markedForReview;
                return (
                  <button
                    key={entry.question.id}
                    type="button"
                    onClick={() => navigate(i)}
                    aria-label={`Go to question ${i + 1}${isMarked ? ", marked for review" : ""}`}
                    aria-current={i === index ? "true" : undefined}
                    className={cn(
                      "relative flex aspect-square items-center justify-center rounded-lg text-xs font-semibold tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      statusFor(entry.question.id),
                      i === index && "outline-2 outline-offset-2 outline-navy",
                    )}
                  >
                    {i + 1}
                    {isMarked && <Flag className="absolute -top-1 -right-1 size-3 fill-warning text-warning" aria-hidden />}
                  </button>
                );
              })}
            </div>
          </aside>

          <section aria-label="Session analytics" className="rounded-2xl border bg-card p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">Session analytics</h2>
              <span className="text-[11px] font-semibold text-success">Live</span>
            </div>
            <dl className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-surface-2 p-3">
                <dt className="eyebrow">Answered</dt>
                <dd className="metric mt-1 text-2xl">
                  {answeredCount}
                  <span className="font-sans text-xs font-normal text-muted-foreground"> / {session.items.length}</span>
                </dd>
              </div>
              <div className="rounded-xl bg-surface-2 p-3">
                <dt className="eyebrow">{isTest ? "Marked" : "Accuracy"}</dt>
                <dd className="metric mt-1 text-2xl">{isTest ? markedCount : answeredCount ? `${Math.round((correctCount / answeredCount) * 100)}%` : "–"}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              {isTest ? "Scores and solutions appear when you finish." : `${correctCount} correct so far · ${unanswered} left.`}
            </p>
          </section>

          <section className="hidden rounded-2xl bg-navy p-4 text-navy-foreground md:block">
            <p className="eyebrow text-navy-foreground/70">Keyboard shortcuts</p>
            <ul className="mt-2 space-y-1 text-xs">
              <li><kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono">1-4</kbd> or <kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono">A-D</kbd> choose an option</li>
              <li><kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono">Enter</kbd> submit</li>
              <li><kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono">←</kbd> <kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono">→</kbd> move between questions</li>
              <li><kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono">M</kbd> mark for review</li>
            </ul>
            <Keyboard className="mt-3 size-5 text-navy-foreground/50" aria-hidden />
          </section>
        </div>
      </div>

      <ReportDialog questionId={questionId} open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  );
}

function Legend({ className, label, flag }: { className: string; label: string; flag?: boolean }) {
  return (
    <li className="flex items-center gap-1.5">
      <span className={cn("relative size-3 shrink-0 rounded-sm", className)} aria-hidden>
        {flag && <Flag className="absolute -top-1 -right-1 size-2.5 fill-warning text-warning" />}
      </span>
      {label}
    </li>
  );
}
