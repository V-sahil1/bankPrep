import { describe, expect, it } from "vitest";
import { questionHash } from "@/lib/question-hash";
import { EXAMS, SUBJECTS } from "@/prisma/seed-data/catalog";
import english from "@/prisma/seed-data/questions/english";
import awareness from "@/prisma/seed-data/questions/general-awareness";
import professional from "@/prisma/seed-data/questions/professional-knowledge";
import quant from "@/prisma/seed-data/questions/quant";
import reasoning from "@/prisma/seed-data/questions/reasoning";

const files = { english, quant, reasoning, "general-awareness": awareness, "professional-knowledge": professional };

describe("catalog", () => {
  it("has the seven required exams", () => {
    expect(EXAMS).toHaveLength(7);
  });
  it("only professional-knowledge is exclusive to IBPS SO IT", () => {
    const offering = EXAMS.filter((e) => (e.subjects as string[]).includes("professional-knowledge")).map((e) => e.slug);
    expect(offering).toEqual(["ibps-so-it"]);
  });
});

for (const [slug, file] of Object.entries(files)) {
  describe(`seed questions: ${slug}`, () => {
    const subject = SUBJECTS.find((s) => s.slug === slug)!;
    const topics = new Set<string>(subject.topics);

    it("covers every topic", () => {
      const covered = new Set(file.questions.map((q) => q.topic));
      expect([...topics].filter((t) => !covered.has(t))).toEqual([]);
    });

    it("uses known topics, four distinct options, and a valid key", () => {
      for (const q of file.questions) {
        expect(topics.has(q.topic), q.topic).toBe(true);
        expect(new Set(q.options).size, q.text).toBe(4);
        expect([0, 1, 2, 3], q.text).toContain(q.correct);
        expect(q.explanation.length, q.text).toBeGreaterThan(15);
      }
    });

    it("links only to contexts that exist", () => {
      const keys = new Set(file.contexts.map((c) => c.key));
      for (const q of file.questions) if (q.context) expect(keys.has(q.context), q.text).toBe(true);
    });

    it("has no duplicate question within a topic", () => {
      const seen = new Map<string, string>();
      const duplicates: string[] = [];
      for (const q of file.questions) {
        const key = `${q.topic}:${questionHash(q.text, q.context, q.formatData)}`;
        if (seen.has(key)) duplicates.push(q.text);
        seen.set(key, q.text);
      }
      expect(duplicates).toEqual([]);
    });

    it("never claims to be from a past paper", () => {
      const claim = /\b(previous[- ]year|pyq|asked in|appeared in)\b/i;
      expect(file.questions.filter((q) => claim.test(q.text) || claim.test(q.explanation)).map((q) => q.text)).toEqual([]);
    });
  });
}
