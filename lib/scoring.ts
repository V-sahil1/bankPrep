export type ScoreLine = {
  sectionName: string;
  marksPerQuestion: number;
  negativeMarks: number;
  /** null means unanswered, which never loses marks. */
  isCorrect: boolean | null;
};

export type SectionScore = {
  name: string;
  score: number;
  maxScore: number;
  correct: number;
  incorrect: number;
  unanswered: number;
};

export type AttemptScore = Omit<SectionScore, "name"> & { sections: SectionScore[] };

const round = (value: number) => Math.round(value * 100) / 100;

export function scoreAttempt(lines: ScoreLine[]): AttemptScore {
  const sections = new Map<string, SectionScore>();
  for (const line of lines) {
    const section =
      sections.get(line.sectionName) ??
      { name: line.sectionName, score: 0, maxScore: 0, correct: 0, incorrect: 0, unanswered: 0 };
    section.maxScore += line.marksPerQuestion;
    if (line.isCorrect === null) section.unanswered += 1;
    else if (line.isCorrect) {
      section.correct += 1;
      section.score += line.marksPerQuestion;
    } else {
      section.incorrect += 1;
      section.score -= line.negativeMarks;
    }
    sections.set(line.sectionName, section);
  }

  const list = [...sections.values()].map((s) => ({ ...s, score: round(s.score), maxScore: round(s.maxScore) }));
  return {
    sections: list,
    score: round(list.reduce((sum, s) => sum + s.score, 0)),
    maxScore: round(list.reduce((sum, s) => sum + s.maxScore, 0)),
    correct: list.reduce((sum, s) => sum + s.correct, 0),
    incorrect: list.reduce((sum, s) => sum + s.incorrect, 0),
    unanswered: list.reduce((sum, s) => sum + s.unanswered, 0),
  };
}

export type TimingSection = { index: number; seconds: number };

export type TimingState =
  | { status: "running"; sectionIndex: number; sectionStartedAt: Date; secondsLeft: number }
  | { status: "expired" };

/**
 * Works out where a sectionally-timed attempt should be, given wall-clock time.
 * If the tab was closed through a section's deadline, the next section begins at
 * that deadline, not when the user returned, so absence cannot buy extra time.
 */
export function resolveSectionTiming(
  sections: TimingSection[],
  currentIndex: number,
  sectionStartedAt: Date,
  now: Date,
): TimingState {
  const ordered = [...sections].sort((a, b) => a.index - b.index);
  let position = ordered.findIndex((s) => s.index === currentIndex);
  if (position === -1) return { status: "expired" };

  let start = sectionStartedAt.getTime();
  while (position < ordered.length) {
    const deadline = start + ordered[position].seconds * 1000;
    if (now.getTime() < deadline) {
      return {
        status: "running",
        sectionIndex: ordered[position].index,
        sectionStartedAt: new Date(start),
        secondsLeft: Math.ceil((deadline - now.getTime()) / 1000),
      };
    }
    start = deadline;
    position += 1;
  }
  return { status: "expired" };
}
