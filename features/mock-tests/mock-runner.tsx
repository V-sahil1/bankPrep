"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, Clock, Flag, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/app/common";
import { ConfirmButton } from "@/components/app/confirm-button";
import { OPTION_LETTERS, QuestionBody } from "@/components/app/question-parts";
import {
  advanceSectionAction,
  saveMockAnswerAction,
  setMockFlagsAction,
  submitMockAction,
} from "@/features/mock-tests/actions";
import { useAction } from "@/hooks/use-action";
import { formatClock } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { MockAttemptView } from "@/services/mock-tests";

type LocalItem = { selectedOptionId: string | null; markedForReview: boolean; visited: boolean };

export function MockRunner({ view }: { view: MockAttemptView }) {
  const router = useRouter();
  const { pending, run } = useAction();

  const [sectionIndex, setSectionIndex] = useState(view.currentSectionIndex);
  const [activeId, setActiveId] = useState(
    () => view.items.find((i) => i.sectionIndex === view.currentSectionIndex)?.question.id ?? view.items[0].question.id,
  );
  const [items, setItems] = useState<Record<string, LocalItem>>(() =>
    Object.fromEntries(
      view.items.map((i) => [
        i.question.id,
        { selectedOptionId: i.selectedOptionId, markedForReview: i.markedForReview, visited: i.visited || i.question.id === activeId },
      ]),
    ),
  );

  const [secondsLeft, setSecondsLeft] = useState(view.secondsLeft);
  const expiring = useRef(false);

  const refreshFromServer = useCallback(() => router.refresh(), [router]);

  const handleExpiry = useCallback(() => {
    if (expiring.current) return;
    expiring.current = true;
    if (view.sectionalTiming) {
      void advanceSectionAction(view.id)
        .then((result) => {
          if (result.ok && result.data.submitted) router.replace(`/mock-tests/attempt/${view.id}/results`);
          else {
            toast.info("Time is up for this section. Moving to the next one.");
            refreshFromServer();
          }
        })
        .catch(() => toast.error("Could not reach the server. Your time is tracked there, so reload when you are back online."));
    } else {
      void submitMockAction({ attemptId: view.id, auto: true })
        .then(() => router.replace(`/mock-tests/attempt/${view.id}/results`))
        .catch(() => toast.error("Could not reach the server. Reload when you are back online."));
    }
  }, [refreshFromServer, router, view.id, view.sectionalTiming]);

  // A section change on the server arrives through router.refresh as new props.
  const [seenSection, setSeenSection] = useState(view.currentSectionIndex);
  if (seenSection !== view.currentSectionIndex) {
    setSeenSection(view.currentSectionIndex);
    setSectionIndex(view.currentSectionIndex);
    setSecondsLeft(view.secondsLeft);
    const first = view.items.find((i) => i.sectionIndex === view.currentSectionIndex);
    if (first) {
      setActiveId(first.question.id);
      setItems((all) => ({ ...all, [first.question.id]: { ...all[first.question.id], visited: true } }));
    }
  }

  // The deadline is fixed from the server's remaining time, so a throttled tab
  // cannot stretch the clock. The server re-checks it on every write anyway.
  useEffect(() => {
    expiring.current = false;
    const deadline = Date.now() + view.secondsLeft * 1000;
    const timer = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) handleExpiry();
    }, 1000);
    return () => clearInterval(timer);
  }, [handleExpiry, view.currentSectionIndex, view.secondsLeft]);

  const sectionItems = view.items.filter((i) => i.sectionIndex === sectionIndex);
  const position = sectionItems.findIndex((i) => i.question.id === activeId);
  const current = sectionItems[Math.max(0, position)];
  const questionId = current.question.id;
  const local = items[questionId];
  const isLastSection = sectionIndex === view.sections[view.sections.length - 1].index;
  const totalAnswered = Object.values(items).filter((i) => i.selectedOptionId).length;
  const totalMarked = Object.values(items).filter((i) => i.markedForReview).length;

  const patch = (id: string, change: Partial<LocalItem>) =>
    setItems((all) => ({ ...all, [id]: { ...all[id], ...change } }));

  // Tell the server once per question; the palette reads local state.
  const reportedVisits = useRef(new Set(view.items.filter((i) => i.visited).map((i) => i.question.id)));
  useEffect(() => {
    if (reportedVisits.current.has(questionId)) return;
    reportedVisits.current.add(questionId);
    void setMockFlagsAction({ attemptId: view.id, questionId, visited: true }).catch(() => undefined);
  }, [questionId, view.id]);

  function open(id: string) {
    setActiveId(id);
    patch(id, { visited: true });
  }

  function choose(optionId: string | null) {
    const previous = local.selectedOptionId;
    patch(questionId, { selectedOptionId: optionId });
    run(() => saveMockAnswerAction({ attemptId: view.id, questionId, optionId }), {
      onError: () => patch(questionId, { selectedOptionId: previous }),
    });
  }

  function toggleMark() {
    const next = !local.markedForReview;
    patch(questionId, { markedForReview: next });
    run(() => setMockFlagsAction({ attemptId: view.id, questionId, markedForReview: next }), {
      onError: () => patch(questionId, { markedForReview: !next }),
    });
  }

  function submitAll() {
    run(() => submitMockAction({ attemptId: view.id, auto: false }), {
      onSuccess: () => router.replace(`/mock-tests/attempt/${view.id}/results`),
    });
  }

  function endSection() {
    run(() => advanceSectionAction(view.id), {
      onSuccess: ({ submitted }) => {
        if (submitted) router.replace(`/mock-tests/attempt/${view.id}/results`);
        else refreshFromServer();
      },
    });
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (event.ctrlKey || event.metaKey || event.altKey || target.closest("input, textarea, select, [role=alertdialog]")) return;
      const key = event.key.toLowerCase();
      if (key === "arrowright") document.getElementById("mock-next")?.click();
      else if (key === "arrowleft") document.getElementById("mock-prev")?.click();
      else if (key === "m") document.getElementById("mock-mark")?.click();
      else if (["1", "2", "3", "4"].includes(key)) document.getElementById(`mock-option-${Number(key) - 1}`)?.click();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const lowTime = secondsLeft <= 60;
  const sectionAnswered = sectionItems.filter((i) => items[i.question.id].selectedOptionId).length;

  return (
    <div>
      <header className="sticky top-16 z-20 mb-5 rounded-2xl border bg-card/95 px-4 py-3 shadow-soft backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              {view.examName} <ChevronRight className="size-3.5" aria-hidden />
            </span>
            <h1 className="truncate font-sans text-sm font-semibold tracking-normal">{view.title}</h1>
          </nav>
          <div className="flex items-center gap-2">
            <span
              role="timer"
              aria-label={`Time left ${formatClock(secondsLeft)}`}
              className={cn(
                "flex h-9 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-sm font-semibold tabular-nums",
                lowTime && "border-danger/50 bg-danger-soft text-danger",
              )}
            >
              <Clock className="size-3.5" aria-hidden /> {formatClock(secondsLeft)}
            </span>
            <ConfirmButton
              size="sm"
              className="h-9"
              destructive={false}
              title="Submit the whole test?"
              description={`You answered ${totalAnswered} of ${view.items.length} questions. You can't change answers after submitting.`}
              confirmLabel="Submit test"
              onConfirm={submitAll}
              disabled={pending}
            >
              Submit test
            </ConfirmButton>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Sections" className="flex gap-1.5 overflow-x-auto">
            {view.sections.map((section) => {
              const locked = view.sectionalTiming && section.index !== sectionIndex;
              return (
                <button
                  key={section.index}
                  type="button"
                  disabled={locked}
                  aria-current={section.index === sectionIndex ? "true" : undefined}
                  onClick={() => {
                    setSectionIndex(section.index);
                    const first = view.items.find((i) => i.sectionIndex === section.index);
                    if (first) open(first.question.id);
                  }}
                  className={cn(
                    "h-8 shrink-0 rounded-full px-3 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    section.index === sectionIndex ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                    locked && "cursor-not-allowed opacity-60 hover:bg-transparent",
                  )}
                >
                  {section.name} ({section.questionCount})
                </button>
              );
            })}
          </nav>
          <p className="text-xs text-muted-foreground tabular-nums">
            {view.sectionalTiming ? "Section time" : "Total time"} · Answered <span className="font-semibold text-foreground">{totalAnswered}/{view.items.length}</span>
          </p>
        </div>
      </header>

      {view.servedCount < view.requestedCount && (
        <p className="mb-4 flex items-start gap-2 rounded-xl border border-warning/40 bg-warning-soft px-3 py-2 text-xs text-warning">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          The question bank could serve {view.servedCount} of the {view.requestedCount} questions in this pattern, so scores are out of a smaller total.
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0 rounded-2xl border bg-card p-5 shadow-soft sm:p-6" aria-label={`Question ${position + 1} of ${sectionItems.length}`}>
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl bg-surface-2 px-3 py-2">
            <Chip tone="primary">{current.sectionName}</Chip>
            <span className="text-xs text-muted-foreground">
              Question <span className="font-semibold text-foreground tabular-nums">{position + 1}</span> of {sectionItems.length}
            </span>
            <span className="ml-auto text-xs tabular-nums">
              <span className="font-semibold text-success">+{current.marksPerQuestion}</span> for correct ·{" "}
              <span className="font-semibold text-danger">-{current.negativeMarks}</span> for wrong
            </span>
          </div>
          <QuestionBody question={current.question} />
          <div role="radiogroup" aria-label="Answer options" className="mt-5 space-y-2">
            {current.question.options.map((option, i) => {
              const selected = local.selectedOptionId === option.id;
              return (
                <button
                  key={option.id}
                  id={`mock-option-${i}`}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => choose(option.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors outline-none hover:border-primary/50 hover:bg-surface-2 focus-visible:ring-3 focus-visible:ring-ring/30",
                    selected && "border-primary bg-accent/60",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg border font-heading text-xs font-semibold",
                      selected && "border-primary bg-primary text-primary-foreground",
                    )}
                  >
                    {OPTION_LETTERS[i]}
                  </span>
                  <span className="min-w-0 flex-1 pt-1 whitespace-pre-line">{option.text}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                id="mock-mark"
                variant="secondary"
                onClick={toggleMark}
                aria-pressed={local.markedForReview}
                className={cn(local.markedForReview && "bg-warning-soft text-warning hover:bg-warning-soft")}
              >
                <Flag className={cn(local.markedForReview && "fill-current")} aria-hidden />
                {local.markedForReview ? "Marked for review" : "Mark for review"}
              </Button>
              <Button variant="ghost" onClick={() => choose(null)} disabled={!local.selectedOptionId}>
                Clear answer
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button id="mock-prev" variant="outline" disabled={position <= 0} onClick={() => open(sectionItems[position - 1].question.id)}>
                <ArrowLeft aria-hidden /> Previous
              </Button>
              <Button id="mock-next" className="h-10 rounded-xl px-5" disabled={position >= sectionItems.length - 1} onClick={() => open(sectionItems[position + 1].question.id)}>
                Next <ArrowRight aria-hidden />
              </Button>
            </div>
          </div>
        </article>

        <div className="space-y-4 xl:sticky xl:top-40 xl:self-start">
          <aside aria-label="Question palette" className="rounded-2xl border bg-card p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between border-b pb-2">
              <h2 className="text-base font-semibold">Question palette</h2>
              <Chip tone="primary">
                {sectionAnswered}/{sectionItems.length}
              </Chip>
            </div>
            <ul className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <li className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-primary" aria-hidden /> Answered</li>
              <li className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-danger-soft ring-1 ring-danger/30" aria-hidden /> Not answered</li>
              <li className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-muted" aria-hidden /> Not visited</li>
              <li className="flex items-center gap-1.5"><Flag className="size-3 fill-warning text-warning" aria-hidden /> Marked ({totalMarked})</li>
            </ul>
            <div className="grid max-h-72 grid-cols-8 gap-1.5 overflow-y-auto p-1 xl:grid-cols-6">
              {sectionItems.map((entry, i) => {
                const state = items[entry.question.id];
                return (
                  <button
                    key={entry.question.id}
                    type="button"
                    onClick={() => open(entry.question.id)}
                    aria-label={`Question ${i + 1}: ${state.selectedOptionId ? "answered" : state.visited ? "not answered" : "not visited"}${state.markedForReview ? ", marked for review" : ""}`}
                    aria-current={entry.question.id === questionId ? "true" : undefined}
                    className={cn(
                      "relative flex aspect-square items-center justify-center rounded-lg text-xs font-semibold tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      state.selectedOptionId
                        ? "bg-primary text-primary-foreground"
                        : state.visited
                          ? "bg-danger-soft text-danger ring-1 ring-danger/30"
                          : "bg-muted text-muted-foreground",
                      entry.question.id === questionId && "outline-2 outline-offset-2 outline-navy",
                    )}
                  >
                    {i + 1}
                    {state.markedForReview && <Flag className="absolute -top-1 -right-1 size-3 fill-warning text-warning" aria-hidden />}
                  </button>
                );
              })}
            </div>
            {view.sectionalTiming && (
              <div className="mt-4 border-t pt-4">
                <ConfirmButton
                  variant="outline"
                  className="w-full"
                  destructive={false}
                  title={isLastSection ? "Finish the last section?" : "End this section early?"}
                  description={isLastSection ? "This submits the test." : "You can't come back to this section, and unused time doesn't carry over."}
                  confirmLabel={isLastSection ? "Finish and submit" : "End section"}
                  onConfirm={endSection}
                  disabled={pending}
                >
                  {pending && <Loader2 className="animate-spin" aria-hidden />}
                  {isLastSection ? "Finish section" : "Next section"}
                </ConfirmButton>
              </div>
            )}
          </aside>

          <section aria-label="Session analytics" className="rounded-2xl border bg-card p-4 shadow-soft">
            <h2 className="mb-3 text-base font-semibold">Session analytics</h2>
            <dl className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-surface-2 p-3">
                <dt className="eyebrow">Answered</dt>
                <dd className="metric mt-1 text-2xl">
                  {totalAnswered}
                  <span className="font-sans text-xs font-normal text-muted-foreground"> / {view.items.length}</span>
                </dd>
              </div>
              <div className="rounded-xl bg-surface-2 p-3">
                <dt className="eyebrow">Marked</dt>
                <dd className="metric mt-1 text-2xl">{totalMarked}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">Scores and solutions appear after you submit.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
