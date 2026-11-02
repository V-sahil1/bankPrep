import { create } from "zustand";
import type { SessionView, SubmitResult } from "@/services/practice";

type ItemState = {
  draftOptionId: string | null;
  selectedOptionId: string | null;
  markedForReview: boolean;
  skipped: boolean;
  isCorrect: boolean | null;
  correctOptionId: string | null;
  explanation: string | null;
};

type RunnerState = {
  sessionId: string | null;
  index: number;
  items: Record<string, ItemState>;
  bookmarked: Record<string, boolean>;
  init: (session: SessionView) => void;
  goTo: (index: number) => void;
  draft: (questionId: string, optionId: string | null) => void;
  applySubmit: (questionId: string, optionId: string, result: SubmitResult) => void;
  applyReveal: (questionId: string, correctOptionId: string | null, explanation: string) => void;
  setMarked: (questionId: string, marked: boolean) => void;
  setSkipped: (questionId: string) => void;
  setBookmarked: (questionId: string, bookmarked: boolean) => void;
};

function patch(state: RunnerState, questionId: string, change: Partial<ItemState>) {
  return { items: { ...state.items, [questionId]: { ...state.items[questionId], ...change } } };
}

/** Client-side state for one running session. The server stays the source of truth. */
export const useRunnerStore = create<RunnerState>((set) => ({
  sessionId: null,
  index: 0,
  items: {},
  bookmarked: {},
  init: (session) =>
    set({
      sessionId: session.id,
      index: Math.min(session.currentIndex, Math.max(0, session.items.length - 1)),
      bookmarked: Object.fromEntries(session.bookmarkedIds.map((id) => [id, true])),
      items: Object.fromEntries(
        session.items.map((item) => [
          item.question.id,
          {
            draftOptionId: item.selectedOptionId,
            selectedOptionId: item.selectedOptionId,
            markedForReview: item.markedForReview,
            skipped: item.skipped,
            isCorrect: item.reveal?.isCorrect ?? null,
            correctOptionId: item.reveal?.correctOptionId ?? null,
            explanation: item.reveal?.explanation ?? null,
          },
        ]),
      ),
    }),
  goTo: (index) => set({ index }),
  draft: (questionId, optionId) => set((s) => patch(s, questionId, { draftOptionId: optionId })),
  applySubmit: (questionId, optionId, result) =>
    set((s) =>
      patch(
        s,
        questionId,
        result.mode === "PRACTICE"
          ? {
              selectedOptionId: optionId,
              skipped: false,
              isCorrect: result.isCorrect,
              correctOptionId: result.correctOptionId,
              explanation: result.explanation,
            }
          : { selectedOptionId: optionId, skipped: false },
      ),
    ),
  applyReveal: (questionId, correctOptionId, explanation) =>
    set((s) => patch(s, questionId, { correctOptionId, explanation, skipped: true })),
  setMarked: (questionId, marked) => set((s) => patch(s, questionId, { markedForReview: marked })),
  setSkipped: (questionId) => set((s) => patch(s, questionId, { skipped: true })),
  setBookmarked: (questionId, bookmarked) =>
    set((s) => ({ bookmarked: { ...s.bookmarked, [questionId]: bookmarked } })),
}));
