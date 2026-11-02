import { describe, expect, it } from "vitest";
import { addDays, computeStreak, dayKey, dbDateKey, weekStart } from "@/lib/dates";
import { questionHash, textSimilarity } from "@/lib/question-hash";
import { clearFailures, isRateLimited, recordFailure } from "@/lib/rate-limit";
import { resolveSectionTiming, scoreAttempt } from "@/lib/scoring";
import { filterGenerated } from "@/services/ai-generation";
import { findWeakTopics, percent, type TopicStat } from "@/services/analytics";
import { pickQuestions } from "@/services/question-view";
import { parseTableText } from "@/validations/admin";
import { csvRecordToImportRow, importRowSchema, questionFormSchema } from "@/validations/question";

describe("scoreAttempt", () => {
  const line = (sectionName: string, isCorrect: boolean | null, marks = 1, negative = 0.25) => ({
    sectionName,
    isCorrect,
    marksPerQuestion: marks,
    negativeMarks: negative,
  });

  it("awards marks, applies negative marking, and never penalises blanks", () => {
    const result = scoreAttempt([line("A", true), line("A", false), line("A", null)]);
    expect(result.score).toBe(0.75);
    expect(result.maxScore).toBe(3);
    expect([result.correct, result.incorrect, result.unanswered]).toEqual([1, 1, 1]);
  });

  it("uses each section's own marking scheme", () => {
    const result = scoreAttempt([line("English", true, 0.5, 0.125), line("English", false, 0.5, 0.125), line("Quant", false, 1, 0.25)]);
    expect(result.sections.find((s) => s.name === "English")?.score).toBe(0.38);
    expect(result.sections.find((s) => s.name === "Quant")?.score).toBe(-0.25);
    expect(result.maxScore).toBe(2);
  });

  it("allows a negative overall score", () => {
    expect(scoreAttempt([line("A", false), line("A", false)]).score).toBe(-0.5);
  });
});

describe("resolveSectionTiming", () => {
  const sections = [
    { index: 0, seconds: 60 },
    { index: 1, seconds: 60 },
  ];
  const start = new Date("2026-01-01T00:00:00Z");
  const at = (seconds: number) => new Date(start.getTime() + seconds * 1000);

  it("reports time left in the current section", () => {
    const state = resolveSectionTiming(sections, 0, start, at(20));
    expect(state).toMatchObject({ status: "running", sectionIndex: 0, secondsLeft: 40 });
  });

  it("starts the next section at the previous deadline, so being away buys no time", () => {
    const state = resolveSectionTiming(sections, 0, start, at(90));
    expect(state).toMatchObject({ status: "running", sectionIndex: 1, secondsLeft: 30 });
    if (state.status === "running") expect(state.sectionStartedAt).toEqual(at(60));
  });

  it("expires after the last deadline", () => {
    expect(resolveSectionTiming(sections, 0, start, at(120)).status).toBe("expired");
    expect(resolveSectionTiming(sections, 1, start, at(60)).status).toBe("expired");
  });
});

describe("computeStreak", () => {
  const today = new Date("2026-03-10T00:00:00.000Z");
  const key = (offset: number) => dbDateKey(addDays(today, offset));

  it("counts consecutive days ending today", () => {
    expect(computeStreak([key(0), key(-1), key(-2), key(-4)], today)).toBe(3);
  });
  it("keeps a streak alive until today has passed", () => {
    expect(computeStreak([key(-1), key(-2)], today)).toBe(2);
  });
  it("is zero after a missed day", () => {
    expect(computeStreak([key(-2), key(-3)], today)).toBe(0);
    expect(computeStreak([], today)).toBe(0);
  });
});

describe("dates", () => {
  it("rolls the calendar day over at midnight in the app timezone, not UTC", () => {
    expect(dayKey(new Date("2026-03-10T18:29:00Z"), "Asia/Kolkata")).toBe("2026-03-10");
    expect(dayKey(new Date("2026-03-10T18:31:00Z"), "Asia/Kolkata")).toBe("2026-03-11");
  });
  it("finds the Monday of a week", () => {
    expect(dbDateKey(weekStart(new Date("2026-03-15T00:00:00Z")))).toBe("2026-03-09");
    expect(dbDateKey(weekStart(new Date("2026-03-09T00:00:00Z")))).toBe("2026-03-09");
  });
});

describe("pickQuestions", () => {
  const q = (id: string, contextId: string | null = null) => ({ id, contextId });

  it("serves unseen questions before seen ones", () => {
    const picked = pickQuestions([q("a"), q("b"), q("c"), q("d")], new Set(["a", "b"]), 2);
    expect(picked.map((p) => p.id).sort()).toEqual(["c", "d"]);
  });
  it("returns what exists when fewer than requested", () => {
    expect(pickQuestions([q("a")], new Set(), 10)).toHaveLength(1);
  });
  it("keeps questions on one passage together", () => {
    const picked = pickQuestions([q("a", "p"), q("x"), q("b", "p"), q("y"), q("c", "p")], new Set(), 5, () => 0.5);
    const positions = picked.flatMap((p, i) => (p.contextId === "p" ? [i] : []));
    expect(positions[2] - positions[0]).toBe(2);
  });
});

describe("weak topics", () => {
  const stat = (topicId: string, attempted: number, correct: number): TopicStat => ({
    topicId,
    topicName: topicId,
    subjectId: "s",
    subjectName: "S",
    attempted,
    correct,
    accuracy: percent(correct, attempted),
  });

  it("needs enough attempts, and sorts worst first", () => {
    const weak = findWeakTopics([stat("few", 2, 0), stat("ok", 10, 9), stat("bad", 10, 2), stat("poor", 10, 5)]);
    expect(weak.map((t) => t.topicId)).toEqual(["bad", "poor"]);
  });
  it("treats zero attempts as zero percent rather than dividing by zero", () => {
    expect(percent(0, 0)).toBe(0);
  });
});

describe("duplicate detection", () => {
  it("ignores case and punctuation", () => {
    expect(questionHash("What is 2 + 2?")).toBe(questionHash("what is 2 2"));
  });
  it("scores near-copies high and different text low", () => {
    expect(textSimilarity("The bank lent money to the farmer at 8 percent interest", "The bank lent money to a farmer at 8 percent interest")).toBeGreaterThan(0.75);
    expect(textSimilarity("Find the simple interest", "Choose the correct preposition")).toBeLessThan(0.2);
  });
});

describe("filterGenerated", () => {
  const good = (questionText: string) => ({
    questionText,
    options: ["one", "two", "three", "four"],
    correctIndex: 1,
    explanation: "A long enough explanation of the answer.",
    tags: ["x"],
  });

  it("drops malformed questions", () => {
    const result = filterGenerated(
      [
        good("A perfectly valid question stem here?"),
        { ...good("Only three options in this stem?"), options: ["a", "b", "c"] },
        { ...good("Repeated options appear in this stem?"), options: ["a", "a", "b", "c"] },
        { ...good("The answer key is out of range here?"), correctIndex: 4 },
        "not even an object",
      ],
      [],
    );
    expect(result.accepted).toHaveLength(1);
    expect(result.invalid).toBe(4);
  });

  it("drops duplicates of the bank and of the same batch", () => {
    const existing = "What is the capital adequacy ratio of a bank under Basel norms?";
    const result = filterGenerated(
      [good(existing), good("WHAT IS THE CAPITAL ADEQUACY RATIO OF A BANK UNDER BASEL NORMS"), good("Who regulates the bond market in India today?"), good("Who regulates the bond market in India today?")],
      [existing],
    );
    expect(result.accepted).toHaveLength(1);
    expect(result.duplicates).toBe(3);
  });
});

describe("question validation", () => {
  const form = {
    examId: "e",
    subjectId: "s",
    topicId: "t",
    questionText: "A valid question?",
    options: ["a", "b", "c", "d"],
    correctIndex: 0,
    explanation: "Because of reasons.",
    difficulty: "EASY",
    sourceType: "ADMIN_AUTHORED",
  };

  it("accepts a complete question", () => {
    expect(questionFormSchema.safeParse(form).success).toBe(true);
  });
  it("requires exactly four distinct options", () => {
    expect(questionFormSchema.safeParse({ ...form, options: ["a", "b", "c"] }).success).toBe(false);
    expect(questionFormSchema.safeParse({ ...form, options: ["a", "A", "c", "d"] }).success).toBe(false);
  });
  it("refuses a PYQ without a source", () => {
    expect(questionFormSchema.safeParse({ ...form, sourceType: "PYQ" }).success).toBe(false);
    expect(questionFormSchema.safeParse({ ...form, sourceType: "PYQ", sourceReference: "IBPS PO 2022 Shift 1" }).success).toBe(true);
  });
});

describe("CSV import rows", () => {
  const record = {
    examSlug: "ibps-po",
    subjectSlug: "quant",
    topic: "Percentage",
    questionText: "What is 10% of 50?",
    optionA: "1",
    optionB: "5",
    optionC: "10",
    optionD: "50",
    correct: "b",
    explanation: "One tenth of 50 is 5.",
    difficulty: "easy",
    tags: "percent|basics",
    relevantExamSlugs: "sbi-po|sbi-clerk",
    sourceType: "",
    sourceReference: "",
  };

  it("maps columns to a valid row", () => {
    const row = importRowSchema.parse(csvRecordToImportRow(record));
    expect(row.correctIndex).toBe(1);
    expect(row.difficulty).toBe("EASY");
    expect(row.tags).toEqual(["percent", "basics"]);
    expect(row.relevantExamSlugs).toEqual(["sbi-po", "sbi-clerk"]);
    expect(row.sourceType).toBe("ADMIN_AUTHORED");
  });
  it("rejects a bad answer letter, and AI as an import source", () => {
    expect(importRowSchema.safeParse(csvRecordToImportRow({ ...record, correct: "E" })).success).toBe(false);
    expect(importRowSchema.safeParse(csvRecordToImportRow({ ...record, sourceType: "AI_GENERATED" })).success).toBe(false);
  });
});

describe("parseTableText", () => {
  it("parses a header and numeric cells", () => {
    expect(parseTableText("Year, Sales\n2021, 40")).toEqual({ columns: ["Year", "Sales"], rows: [[2021, 40]] });
  });
  it("is null when empty, and rejects uneven rows", () => {
    expect(parseTableText("  \n ")).toBeNull();
    expect(() => parseTableText("a,b\n1")).toThrow();
  });
});

describe("rate limiter", () => {
  it("locks after repeated failures and unlocks after the window", () => {
    const key = "limit-test@example.com";
    clearFailures(key);
    const start = 1_000_000;
    for (let i = 0; i < 8; i += 1) recordFailure(key, start);
    expect(isRateLimited(key, start + 1000)).toBe(true);
    expect(isRateLimited(key, start + 16 * 60 * 1000)).toBe(false);
  });
});
