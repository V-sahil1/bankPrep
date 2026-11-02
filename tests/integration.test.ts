// Runs against the real database (npm run db). It creates its own users and
// question, and removes them afterwards.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { filterGenerated, runGenerationJob } from "@/services/ai-generation";
import { getAnalytics, getDashboard } from "@/services/analytics";
import * as mock from "@/services/mock-tests";
import { getBookmarks, getMistakes, getVerifiedPyqSummary } from "@/services/notebook";
import * as practice from "@/services/practice";
import { commitImport, reviewQuestions, saveQuestion, validateImport, verifyPyq } from "@/services/question-bank";

const stamp = Date.now();
let alice: string;
let bob: string;
let examId: string;
let otherExamId: string;
let subjectId: string;
let topicId: string;
const createdQuestionIds: string[] = [];

async function correctOption(questionId: string) {
  return prisma.questionOption.findFirstOrThrow({ where: { questionId, isCorrect: true } });
}
async function wrongOption(questionId: string) {
  return prisma.questionOption.findFirstOrThrow({ where: { questionId, isCorrect: false } });
}

beforeAll(async () => {
  const make = (name: string) =>
    prisma.user.create({ data: { name, email: `${name}-${stamp}@test.local`, passwordHash: "x" }, select: { id: true } });
  alice = (await make("alice")).id;
  bob = (await make("bob")).id;
  examId = (await prisma.exam.findUniqueOrThrow({ where: { slug: "ibps-po" } })).id;
  otherExamId = (await prisma.exam.findUniqueOrThrow({ where: { slug: "ibps-so-it" } })).id;
  const topic = await prisma.topic.findFirstOrThrow({ where: { name: "Percentage" } });
  topicId = topic.id;
  subjectId = topic.subjectId;
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { id: { in: [alice, bob] } } });
  await prisma.question.deleteMany({ where: { id: { in: createdQuestionIds } } });
  await prisma.$disconnect();
});

const start = (mode: "PRACTICE" | "TEST", count = 4, difficulty: "EASY" | "MIXED" = "MIXED") =>
  practice.startTopicSession(alice, { common: false, examId, subjectId, topicId, difficulty, count, mode });

describe("practice mode", () => {
  it("hides answers until submission, then reveals and records them", async () => {
    const { sessionId } = await start("PRACTICE");
    const before = (await practice.getSessionView(alice, sessionId))!;
    expect(before.items.every((i) => i.reveal === null)).toBe(true);

    // The serialised payload itself must not leak the key or the explanation.
    const payload = JSON.stringify(before);
    expect(payload).not.toContain("isCorrect\":true");
    const dbQuestion = await prisma.question.findUniqueOrThrow({ where: { id: before.items[0].question.id } });
    expect(payload).not.toContain(dbQuestion.explanation);

    const questionId = before.items[0].question.id;
    const wrong = await wrongOption(questionId);
    const result = await practice.submitAnswer(alice, { sessionId, questionId, optionId: wrong.id, timeSpentSec: 12 });
    expect(result).toMatchObject({ mode: "PRACTICE", isCorrect: false });

    const after = (await practice.getSessionView(alice, sessionId))!;
    expect(after.items[0].reveal?.explanation).toBe(dbQuestion.explanation);
    expect(after.items[1].reveal).toBeNull();
    expect(after.incorrectCount).toBe(1);
  });

  it("refuses a second answer to the same question", async () => {
    const { sessionId } = await start("PRACTICE");
    const view = (await practice.getSessionView(alice, sessionId))!;
    const questionId = view.items[0].question.id;
    const option = await correctOption(questionId);
    await practice.submitAnswer(alice, { sessionId, questionId, optionId: option.id, timeSpentSec: 1 });
    await expect(practice.submitAnswer(alice, { sessionId, questionId, optionId: option.id, timeSpentSec: 1 })).rejects.toThrow(/already answered/);
  });

  it("rejects an option from a different question", async () => {
    const { sessionId } = await start("PRACTICE");
    const view = (await practice.getSessionView(alice, sessionId))!;
    const foreign = await correctOption(view.items[1].question.id);
    await expect(
      practice.submitAnswer(alice, { sessionId, questionId: view.items[0].question.id, optionId: foreign.id, timeSpentSec: 1 }),
    ).rejects.toThrow(/does not belong/);
  });

  it("locks a question for credit after its explanation was viewed early", async () => {
    const { sessionId } = await start("PRACTICE");
    const view = (await practice.getSessionView(alice, sessionId))!;
    const questionId = view.items[0].question.id;
    const reveal = await practice.revealQuestion(alice, sessionId, questionId);
    expect(reveal.correctOptionId).toBeTruthy();
    await expect(
      practice.submitAnswer(alice, { sessionId, questionId, optionId: reveal.correctOptionId!, timeSpentSec: 1 }),
    ).rejects.toThrow(/can't be answered/);
  });
});

describe("test mode", () => {
  it("hides answers until finish, lets answers change, and counts stats only at the end", async () => {
    const before = await prisma.dailyActivity.aggregate({ where: { userId: alice }, _sum: { attempted: true } });
    const { sessionId } = await start("TEST", 3);
    const view = (await practice.getSessionView(alice, sessionId))!;
    const questionId = view.items[0].question.id;

    const wrong = await wrongOption(questionId);
    const right = await correctOption(questionId);
    expect(await practice.submitAnswer(alice, { sessionId, questionId, optionId: wrong.id, timeSpentSec: 5 })).toEqual({ mode: "TEST", saved: true });
    await practice.submitAnswer(alice, { sessionId, questionId, optionId: right.id, timeSpentSec: 5 });

    const mid = (await practice.getSessionView(alice, sessionId))!;
    expect(mid.items[0].reveal).toBeNull();
    expect(mid.items[0].selectedOptionId).toBe(right.id);
    await expect(practice.revealQuestion(alice, sessionId, questionId)).rejects.toThrow(/hidden until/);
    const during = await prisma.dailyActivity.aggregate({ where: { userId: alice }, _sum: { attempted: true } });
    expect(during._sum.attempted).toBe(before._sum.attempted);

    await practice.finishSession(alice, sessionId);
    const done = (await practice.getSessionView(alice, sessionId))!;
    expect(done.status).toBe("COMPLETED");
    expect(done.correctCount).toBe(1);
    expect(done.skippedCount).toBe(2);
    expect(done.items.every((i) => i.reveal !== null)).toBe(true);
    const after = await prisma.dailyActivity.aggregate({ where: { userId: alice }, _sum: { attempted: true } });
    expect(after._sum.attempted).toBe((before._sum.attempted ?? 0) + 1);

    // Finishing twice must not count twice.
    await practice.finishSession(alice, sessionId);
    const again = await prisma.dailyActivity.aggregate({ where: { userId: alice }, _sum: { attempted: true } });
    expect(again._sum.attempted).toBe(after._sum.attempted);
  });
});

describe("user isolation", () => {
  it("keeps one user's session, attempts and notebook from another", async () => {
    const { sessionId } = await start("PRACTICE");
    const view = (await practice.getSessionView(alice, sessionId))!;
    const questionId = view.items[0].question.id;
    const option = await correctOption(questionId);

    expect(await practice.getSessionView(bob, sessionId)).toBeNull();
    await expect(practice.submitAnswer(bob, { sessionId, questionId, optionId: option.id, timeSpentSec: 1 })).rejects.toThrow(/not found/);
    await expect(practice.finishSession(bob, sessionId)).rejects.toThrow(/not found/);
    await practice.abandonSession(bob, sessionId);
    expect((await practice.getSessionView(alice, sessionId))!.status).toBe("IN_PROGRESS");

    await practice.toggleBookmark(alice, questionId);
    expect((await getBookmarks(alice)).some((b) => b.question.id === questionId)).toBe(true);
    expect(await getBookmarks(bob)).toHaveLength(0);
    expect(await getMistakes(bob)).toHaveLength(0);
  });
});

describe("exam separation", () => {
  it("never serves a question outside the selected exam, unless in common mode", async () => {
    const topic = await prisma.topic.findFirstOrThrow({ where: { name: "SQL" } });
    await expect(
      practice.startTopicSession(alice, { common: false, examId, subjectId: topic.subjectId, topicId: topic.id, difficulty: "MIXED", count: 5, mode: "PRACTICE" }),
    ).rejects.toThrow(/not part of the selected exam/);

    const common = await practice.startTopicSession(alice, { common: true, examId: null, subjectId: topic.subjectId, topicId: topic.id, difficulty: "MIXED", count: 5, mode: "PRACTICE" });
    expect(common.served).toBeGreaterThan(0);

    const scoped = await practice.startTopicSession(alice, { common: false, examId: otherExamId, subjectId: topic.subjectId, topicId: topic.id, difficulty: "MIXED", count: 5, mode: "PRACTICE" });
    const view = (await practice.getSessionView(alice, scoped.sessionId))!;
    const links = await prisma.questionExam.findMany({ where: { questionId: { in: view.items.map((i) => i.question.id) }, examId: otherExamId } });
    expect(links).toHaveLength(view.items.length);
  });

  it("honours a topic an admin switched off for an exam", async () => {
    await prisma.examTopic.update({ where: { examId_topicId: { examId, topicId } }, data: { isActive: false } });
    try {
      await expect(start("PRACTICE")).rejects.toThrow(/not part of the selected exam/);
    } finally {
      await prisma.examTopic.update({ where: { examId_topicId: { examId, topicId } }, data: { isActive: true } });
    }
  });
});

describe("mistake notebook", () => {
  it("records wrong answers, and marks them fixed on a correct retry", async () => {
    const { sessionId } = await start("PRACTICE", 2);
    const view = (await practice.getSessionView(alice, sessionId))!;
    const questionId = view.items[0].question.id;
    await prisma.mistake.deleteMany({ where: { userId: alice, questionId } });

    const wrong = await wrongOption(questionId);
    await practice.submitAnswer(alice, { sessionId, questionId, optionId: wrong.id, timeSpentSec: 3 });
    const entry = (await getMistakes(alice)).find((m) => m.questionId === questionId)!;
    expect(entry).toMatchObject({ isResolved: false, wrongCount: 1, lastWrongOptionId: wrong.id });

    const retry = await practice.startListSession(alice, { source: "MISTAKES", mode: "PRACTICE", questionId });
    expect(retry.served).toBe(1);
    const right = await correctOption(questionId);
    await practice.submitAnswer(alice, { sessionId: retry.sessionId, questionId, optionId: right.id, timeSpentSec: 3 });
    const fixed = (await getMistakes(alice)).find((m) => m.questionId === questionId)!;
    expect(fixed).toMatchObject({ isResolved: true, correctRetryCount: 1 });

    // Getting it wrong again reopens it.
    const again = await practice.startListSession(alice, { source: "MISTAKES", mode: "PRACTICE", questionId });
    await practice.submitAnswer(alice, { sessionId: again.sessionId, questionId, optionId: wrong.id, timeSpentSec: 3 });
    expect((await getMistakes(alice)).find((m) => m.questionId === questionId)).toMatchObject({ isResolved: false, wrongCount: 2 });
  });
});

describe("analytics", () => {
  it("is computed from this user's real answers", async () => {
    const data = await getAnalytics(alice);
    expect(data.attempted).toBe(data.correct + data.incorrect);
    expect(data.attempted).toBeGreaterThan(0);
    expect(data.topics.find((t) => t.topicId === topicId)).toBeTruthy();
    const empty = await getAnalytics(bob);
    expect(empty.attempted).toBe(0);
    const dashboard = await getDashboard(alice, examId, 30);
    expect(dashboard.todayAttempted).toBeGreaterThan(0);
    expect(dashboard.streak).toBe(1);
  });
});

describe("mock tests", () => {
  async function miniMock() {
    return prisma.mockTest.findFirstOrThrow({ where: { examId, scalePercent: 25 } });
  }

  it("resumes the running attempt rather than starting another", async () => {
    const test = await miniMock();
    const first = await mock.startMockAttempt(bob, test.id);
    const second = await mock.startMockAttempt(bob, test.id);
    expect(second.attemptId).toBe(first.attemptId);
    expect(second.resumed).toBe(true);
    await mock.submitAttempt(bob, first.attemptId, false);
  });

  it("never sends answer keys in the running view, and enforces section order", async () => {
    const test = await miniMock();
    const { attemptId } = await mock.startMockAttempt(alice, test.id);
    const running = await mock.getRunningAttempt(alice, attemptId);
    if (!running || running.submitted) throw new Error("expected a running attempt");
    expect(JSON.stringify(running.view)).not.toContain("isCorrect");
    expect(JSON.stringify(running.view)).not.toContain("explanation");
    expect(await mock.getRunningAttempt(bob, attemptId)).toBeNull();

    const later = running.view.items.find((i) => i.sectionIndex === 1)!;
    const opt = later.question.options[0].id;
    await expect(mock.saveMockAnswer(alice, attemptId, later.question.id, opt)).rejects.toThrow(/section/);

    const first = running.view.items.find((i) => i.sectionIndex === 0)!;
    const wrong = await wrongOption(first.question.id);
    await mock.saveMockAnswer(alice, attemptId, first.question.id, wrong.id);

    const second = running.view.items.filter((i) => i.sectionIndex === 0)[1];
    const right = await correctOption(second.question.id);
    await mock.saveMockAnswer(alice, attemptId, second.question.id, right.id);

    expect((await mock.advanceSection(alice, attemptId)).submitted).toBe(false);
    // The first section is now closed.
    await expect(mock.saveMockAnswer(alice, attemptId, first.question.id, null)).rejects.toThrow(/section/);

    await mock.submitAttempt(alice, attemptId, false);
    const result = (await mock.getAttemptResult(alice, attemptId))!;
    expect(result.summary.correct).toBe(1);
    expect(result.summary.incorrect).toBe(1);
    const section = result.items[0];
    expect(result.summary.score).toBe(section.marksPerQuestion - section.negativeMarks);
    expect(await mock.getAttemptResult(bob, attemptId)).toBeNull();
    await expect(mock.saveMockAnswer(alice, attemptId, second.question.id, null)).rejects.toThrow(/already been submitted/);

    // Submitting twice (timer and button racing) must score once.
    const activity = await prisma.dailyActivity.aggregate({ where: { userId: alice }, _sum: { attempted: true } });
    await mock.submitAttempt(alice, attemptId, true);
    const unchanged = await prisma.dailyActivity.aggregate({ where: { userId: alice }, _sum: { attempted: true } });
    expect(unchanged._sum.attempted).toBe(activity._sum.attempted);
  });

  it("auto-submits when the time ran out while the user was away", async () => {
    const test = await miniMock();
    const { attemptId } = await mock.startMockAttempt(bob, test.id);
    await prisma.mockTestAttempt.update({ where: { id: attemptId }, data: { sectionStartedAt: new Date(Date.now() - 24 * 3600 * 1000) } });
    expect(await mock.getRunningAttempt(bob, attemptId)).toEqual({ submitted: true });
    expect((await mock.getAttemptResult(bob, attemptId))!.autoSubmitted).toBe(true);
  });

  it("refuses answers after the deadline", async () => {
    const test = await miniMock();
    const { attemptId } = await mock.startMockAttempt(bob, test.id);
    const running = await mock.getRunningAttempt(bob, attemptId);
    if (!running || running.submitted) throw new Error("expected a running attempt");
    const item = running.view.items[0];
    await prisma.mockTestAttempt.update({ where: { id: attemptId }, data: { sectionStartedAt: new Date(Date.now() - 24 * 3600 * 1000) } });
    await expect(mock.saveMockAnswer(bob, attemptId, item.question.id, item.question.options[0].id)).rejects.toThrow(/Time is up/);
    await mock.submitAttempt(bob, attemptId, true);
  });

  it("reports a shortfall when the bank cannot fill the pattern", async () => {
    const test = await prisma.mockTest.findFirstOrThrow({ where: { exam: { slug: "rbi-grade-b" }, scalePercent: 100 } });
    const { attemptId } = await mock.startMockAttempt(bob, test.id);
    const attempt = await prisma.mockTestAttempt.findUniqueOrThrow({ where: { id: attemptId } });
    expect(attempt.requestedCount).toBe(200);
    expect(attempt.servedCount).toBeLessThan(200);
    expect(attempt.servedCount).toBeGreaterThan(0);
    await mock.submitAttempt(bob, attemptId, false);
  });
});

describe("PYQ integrity", () => {
  it("keeps a PYQ away from learners until verified, and un-verifies when its source changes", async () => {
    const text = `Unverified PYQ integration ${stamp}?`;
    const id = await saveQuestion(null, {
      examId,
      subjectId,
      topicId,
      questionText: text,
      options: ["a1", "b1", "c1", "d1"],
      correctIndex: 0,
      explanation: "An explanation for this question.",
      difficulty: "HARD",
      sourceType: "PYQ",
      sourceReference: "IBPS PO test source",
    });
    createdQuestionIds.push(id);

    await expect(practice.startListSession(alice, { source: "PYQ", mode: "PRACTICE", questionId: id })).rejects.toThrow(/No questions/);
    expect((await getVerifiedPyqSummary()).some((e) => e.topics.some((t) => t.topicId === topicId))).toBe(false);

    await expect(verifyPyq(bob, id, "  ", true)).rejects.toThrow(/source/);
    await verifyPyq(bob, id, "IBPS PO test source", true);
    expect((await practice.startListSession(alice, { source: "PYQ", mode: "PRACTICE", questionId: id })).served).toBe(1);

    await saveQuestion(id, {
      examId,
      subjectId,
      topicId,
      questionText: text,
      options: ["a1", "b1", "c1", "d1"],
      correctIndex: 0,
      explanation: "An explanation for this question.",
      difficulty: "HARD",
      sourceType: "PYQ",
      sourceReference: "A different source",
    });
    const row = await prisma.question.findUniqueOrThrow({ where: { id } });
    expect(row.pyqVerifiedAt).toBeNull();
  });

  it("does not ship any seeded PYQ", async () => {
    const seededPyq = await prisma.question.count({ where: { sourceType: "PYQ", sourceReference: { contains: "Illustrative" } } });
    expect(seededPyq).toBe(0);
  });
});

describe("AI generation (with a stubbed model)", () => {
  it("stores valid questions for review only, and keeps them from learners until approved", async () => {
    const generated = {
      questionText: `A generated percentage question number ${stamp} about loan interest rates?`,
      options: ["10%", "12%", "14%", "16%"],
      correctIndex: 2,
      explanation: "A detailed explanation of how the percentage is worked out.",
      tags: ["ai"],
    };
    const result = await runGenerationJob(
      alice,
      { examId, subjectId, topicId, difficulty: "EASY", count: 2 },
      async () => ({ raw: [generated, { ...generated, options: ["a"] }], model: "stub-model" }),
    );
    expect(result).toMatchObject({ generated: 1, invalid: 1, duplicates: 0 });

    const row = await prisma.question.findFirstOrThrow({ where: { aiJobId: result.jobId }, include: { options: true } });
    createdQuestionIds.push(row.id);
    expect(row.status).toBe("PENDING_REVIEW");
    expect(row.sourceType).toBe("AI_GENERATED");
    expect(row.sourceReference).not.toMatch(/\b(19|20)\d\d\b/);
    expect(row.options.find((o) => o.isCorrect)?.text).toBe("14%");

    const availability = async () => (await practice.getTopicAvailability(examId))[topicId].EASY;
    const before = await availability();
    expect(await reviewQuestions([row.id], "APPROVED")).toBe(1);
    expect(await availability()).toBe(before + 1);
  });

  it("marks a job failed with a readable message when the model errors", async () => {
    await expect(
      runGenerationJob(alice, { examId, subjectId, topicId, difficulty: "EASY", count: 1 }, async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow(/generation failed/i);
    const job = await prisma.aIQuestionGenerationJob.findFirstOrThrow({ where: { createdById: alice, status: "FAILED" } });
    expect(job.error).toBeTruthy();
  });

  it("refuses to run with no API key configured", async () => {
    const saved = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = "";
    try {
      await expect(runGenerationJob(alice, { examId, subjectId, topicId, difficulty: "EASY", count: 1 })).rejects.toThrow(/not configured/);
    } finally {
      process.env.GEMINI_API_KEY = saved;
    }
  });

  it("filterGenerated is exported for reuse", () => {
    expect(filterGenerated([], [])).toEqual({ accepted: [], invalid: 0, duplicates: 0 });
  });
});

describe("database exposure", () => {
  it("has row level security on every table, so Supabase's REST API can't read them", async () => {
    const open = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = current_schema() AND NOT rowsecurity`;
    expect(open.map((t) => t.tablename)).toEqual([]);
  });
});

describe("bulk import", () => {
  const row = (questionText: string) => ({
    examSlug: "ibps-po",
    subjectSlug: "quant",
    topic: "Percentage",
    questionText,
    options: ["1", "2", "3", "4"],
    correctIndex: 0,
    explanation: "An explanation for this one.",
    difficulty: "EASY",
    relevantExamSlugs: ["sbi-po"],
  });

  it("reports per-row errors and writes nothing when any row is bad", async () => {
    const rows = [row(`Import good ${stamp}?`), { ...row(`Import bad ${stamp}?`), examSlug: "no-such-exam" }, row(`Import good ${stamp}?`)];
    const { results } = await validateImport(rows);
    expect(results[0].ok).toBe(true);
    expect(results[1].ok).toBe(false);
    expect(results[2].ok).toBe(false);
    await expect(commitImport(rows)).rejects.toThrow(/row\(s\) have errors/);
    expect(await prisma.question.count({ where: { questionText: `Import good ${stamp}?` } })).toBe(0);
  });

  it("imports valid rows with their exam relevance", async () => {
    const text = `Import ok ${stamp}?`;
    expect(await commitImport([row(text)])).toBe(1);
    const created = await prisma.question.findFirstOrThrow({ where: { questionText: text }, include: { relevantExams: true } });
    createdQuestionIds.push(created.id);
    expect(created.relevantExams).toHaveLength(2);
    expect((await validateImport([row(text)])).results[0].ok).toBe(false);
  });
});
