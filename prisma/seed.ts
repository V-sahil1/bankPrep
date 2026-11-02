import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
import { questionHash } from "../lib/question-hash";
import { EXAMS, PATTERN_NOTE, SUBJECTS } from "./seed-data/catalog";
import type { SeedQuestionFile } from "./seed-data/types";

const prisma = new PrismaClient();

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const ILLUSTRATIVE_REFERENCE = "Illustrative sample written for BankPrep; not from a past paper.";

async function seedUsers() {
  const accounts = [
    { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD, name: "BankPrep Admin", role: "ADMIN" as const },
    { email: process.env.SEED_DEMO_EMAIL, password: process.env.SEED_DEMO_PASSWORD, name: "Demo Learner", role: "USER" as const },
  ];
  for (const account of accounts) {
    if (!account.email || !account.password) {
      throw new Error("Set SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_DEMO_EMAIL and SEED_DEMO_PASSWORD in .env before seeding.");
    }
    const email = account.email.toLowerCase();
    await prisma.user.upsert({
      where: { email },
      create: { email, name: account.name, role: account.role, passwordHash: await bcrypt.hash(account.password, 10) },
      update: {},
    });
  }
}

async function seedCatalog() {
  for (const [order, subject] of SUBJECTS.entries()) {
    const row = await prisma.subject.upsert({
      where: { slug: subject.slug },
      create: { slug: subject.slug, name: subject.name, order },
      update: {},
    });
    for (const [topicOrder, name] of subject.topics.entries()) {
      const slug = slugify(name);
      await prisma.topic.upsert({
        where: { subjectId_slug: { subjectId: row.id, slug } },
        create: { subjectId: row.id, slug, name, order: topicOrder },
        update: {},
      });
    }
  }

  const subjects = await prisma.subject.findMany({ include: { topics: true } });
  const bySlug = new Map(subjects.map((s) => [s.slug, s]));

  for (const [order, exam] of EXAMS.entries()) {
    const row = await prisma.exam.upsert({
      where: { slug: exam.slug },
      create: { slug: exam.slug, name: exam.name, shortName: exam.shortName, description: exam.description, order },
      update: {},
    });

    for (const [subjectOrder, slug] of exam.subjects.entries()) {
      const subject = bySlug.get(slug)!;
      await prisma.examSubject.upsert({
        where: { examId_subjectId: { examId: row.id, subjectId: subject.id } },
        create: { examId: row.id, subjectId: subject.id, order: subjectOrder },
        update: {},
      });
      for (const topic of subject.topics) {
        if (exam.excludedTopics?.includes(topic.name)) continue;
        await prisma.examTopic.upsert({
          where: { examId_topicId: { examId: row.id, topicId: topic.id } },
          create: { examId: row.id, topicId: topic.id, order: topic.order },
          update: {},
        });
      }
    }

    // Patterns and mocks are only created once, so admin edits survive a re-seed.
    const existing = await prisma.examPattern.findUnique({
      where: { examId_name: { examId: row.id, name: exam.pattern.name } },
    });
    if (existing) continue;

    const pattern = await prisma.examPattern.create({
      data: {
        examId: row.id,
        name: exam.pattern.name,
        sectionalTiming: true,
        notes: PATTERN_NOTE,
        sections: {
          create: exam.pattern.sections.map((section, sectionOrder) => ({
            subjectId: bySlug.get(section.subject)!.id,
            name: section.name,
            order: sectionOrder,
            questionCount: section.questions,
            durationMinutes: section.minutes,
            marksPerQuestion: section.marks,
            negativeMarks: section.negative,
          })),
        },
      },
    });
    await prisma.mockTest.createMany({
      data: [
        {
          examId: row.id,
          patternId: pattern.id,
          title: `${exam.shortName} Mini Mock`,
          description: "A quarter-length drill with the same sections and marking.",
          scalePercent: 25,
        },
        {
          examId: row.id,
          patternId: pattern.id,
          title: `${exam.shortName} ${exam.pattern.name} Full Mock`,
          description: "The full pattern. If the bank is short of questions, the test tells you what it could serve.",
          scalePercent: 100,
        },
      ],
    });
  }
}

async function loadQuestionFiles() {
  const dir = path.join(__dirname, "seed-data", "questions");
  const files: { slug: string; file: SeedQuestionFile }[] = [];
  for (const name of fs.readdirSync(dir).filter((f) => f.endsWith(".ts"))) {
    const loaded = await import(pathToFileURL(path.join(dir, name)).href);
    const file: SeedQuestionFile = loaded.default?.default ?? loaded.default;
    files.push({ slug: name.replace(/\.ts$/, ""), file });
  }
  return files;
}

async function seedQuestions() {
  const subjects = await prisma.subject.findMany({
    include: { topics: true, exams: { select: { examId: true } } },
  });
  const exams = await prisma.exam.findMany({ include: { topics: { select: { topicId: true } } } });
  const examBySlug = new Map(exams.map((e) => [e.slug, e]));

  let created = 0;
  let skipped = 0;

  for (const { slug, file } of await loadQuestionFiles()) {
    const subject = subjects.find((s) => s.slug === slug);
    if (!subject) throw new Error(`No subject for question file "${slug}".`);

    const contextIds = new Map<string, string>();
    for (const context of file.contexts) {
      const existing = await prisma.questionContext.findFirst({ where: { title: context.title, content: context.content } });
      const row =
        existing ??
        (await prisma.questionContext.create({
          data: {
            type: context.type,
            title: context.title,
            content: context.content,
            table: context.table ?? Prisma.DbNull,
          },
        }));
      contextIds.set(context.key, row.id);
    }

    const subjectExamIds = subject.exams.map((e) => e.examId);

    for (const q of file.questions) {
      const topic = subject.topics.find((t) => t.name === q.topic);
      if (!topic) throw new Error(`Unknown topic "${q.topic}" in ${slug}.`);
      if (new Set(q.options).size !== 4) throw new Error(`Options are not distinct: ${q.text}`);
      if (q.context && !contextIds.has(q.context)) throw new Error(`Unknown context "${q.context}" in ${slug}.`);

      const contentHash = questionHash(q.text, q.context, q.formatData);
      const existing = await prisma.question.findUnique({
        where: { topicId_contentHash: { topicId: topic.id, contentHash } },
        select: { id: true },
      });
      if (existing) {
        skipped += 1;
        continue;
      }

      const relevant = q.exams
        ? q.exams.map((examSlug) => {
            const exam = examBySlug.get(examSlug);
            if (!exam) throw new Error(`Unknown exam slug "${examSlug}".`);
            return exam.id;
          })
        : subjectExamIds;
      // Respect each exam's configuration: an excluded topic gets no questions.
      const relevantExamIds = relevant.filter((id) => exams.find((e) => e.id === id)?.topics.some((t) => t.topicId === topic.id));
      const examId = relevantExamIds[0];
      if (!examId) throw new Error(`No exam offers "${q.topic}" for: ${q.text}`);

      const subtopicId = q.subtopic
        ? (
            await prisma.subtopic.upsert({
              where: { topicId_slug: { topicId: topic.id, slug: slugify(q.subtopic) } },
              create: { topicId: topic.id, slug: slugify(q.subtopic), name: q.subtopic },
              update: {},
            })
          ).id
        : null;

      await prisma.question.create({
        data: {
          examId,
          subjectId: subject.id,
          topicId: topic.id,
          subtopicId,
          contextId: q.context ? contextIds.get(q.context) : null,
          format: q.format ?? "MCQ",
          questionText: q.text,
          formatData: q.formatData ?? Prisma.DbNull,
          explanation: q.explanation,
          difficulty: q.difficulty,
          sourceType: "ILLUSTRATIVE_SAMPLE",
          sourceReference: ILLUSTRATIVE_REFERENCE,
          tags: q.tags,
          status: "APPROVED",
          contentHash,
          options: { create: q.options.map((text, order) => ({ text, order, isCorrect: order === q.correct })) },
          relevantExams: { create: relevantExamIds.map((id) => ({ examId: id })) },
        },
      });
      created += 1;
    }
  }
  return { created, skipped };
}

async function main() {
  await seedUsers();
  await seedCatalog();
  const { created, skipped } = await seedQuestions();
  const pyqCount = await prisma.question.count({ where: { sourceType: "PYQ" } });
  console.log(`Seeded. Questions created: ${created}, already present: ${skipped}. PYQs (must be 0 from seed): ${pyqCount}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
