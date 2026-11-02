import { Prisma, type Difficulty, type QuestionStatus, type SourceType } from "@prisma/client";
import { z } from "zod";
import { AppError } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { questionHash } from "@/lib/question-hash";
import { importRowSchema, questionFormSchema, type ImportRow } from "@/validations/question";

export type QuestionFilters = {
  search?: string;
  examId?: string;
  subjectId?: string;
  topicId?: string;
  difficulty?: Difficulty;
  sourceType?: SourceType;
  status?: QuestionStatus;
  page?: number;
};

export const QUESTION_PAGE_SIZE = 25;

export async function listQuestions(filters: QuestionFilters) {
  const where: Prisma.QuestionWhereInput = {
    ...(filters.search ? { questionText: { contains: filters.search, mode: "insensitive" } } : {}),
    ...(filters.examId ? { relevantExams: { some: { examId: filters.examId } } } : {}),
    ...(filters.subjectId ? { subjectId: filters.subjectId } : {}),
    ...(filters.topicId ? { topicId: filters.topicId } : {}),
    ...(filters.difficulty ? { difficulty: filters.difficulty } : {}),
    ...(filters.sourceType ? { sourceType: filters.sourceType } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  };
  const page = Math.max(1, filters.page ?? 1);
  const [total, questions] = await Promise.all([
    prisma.question.count({ where }),
    prisma.question.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * QUESTION_PAGE_SIZE,
      take: QUESTION_PAGE_SIZE,
      include: {
        topic: { select: { name: true } },
        subject: { select: { name: true } },
        exam: { select: { shortName: true } },
      },
    }),
  ]);
  return { total, page, pageCount: Math.max(1, Math.ceil(total / QUESTION_PAGE_SIZE)), questions };
}

export async function getQuestionForEdit(id: string) {
  return prisma.question.findUnique({
    where: { id },
    include: {
      options: { orderBy: { order: "asc" } },
      relevantExams: { select: { examId: true } },
      subtopic: { select: { name: true } },
    },
  });
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function resolveSubtopic(tx: Prisma.TransactionClient, topicId: string, name?: string) {
  if (!name) return null;
  const slug = slugify(name);
  const subtopic = await tx.subtopic.upsert({
    where: { topicId_slug: { topicId, slug } },
    create: { topicId, slug, name },
    update: {},
    select: { id: true },
  });
  return subtopic.id;
}

function duplicateError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function saveQuestion(id: string | null, raw: unknown) {
  const input = questionFormSchema.parse(raw);

  const topic = await prisma.topic.findFirst({ where: { id: input.topicId, subjectId: input.subjectId }, select: { id: true } });
  if (!topic) throw new AppError("That topic does not belong to the selected subject.");

  const relevantExamIds = [...new Set([input.examId, ...input.relevantExamIds])];
  const data = {
    examId: input.examId,
    subjectId: input.subjectId,
    topicId: input.topicId,
    contextId: input.contextId,
    questionText: input.questionText,
    formatData: input.formatData ?? Prisma.DbNull,
    format: input.format,
    explanation: input.explanation,
    difficulty: input.difficulty,
    sourceType: input.sourceType,
    sourceReference: input.sourceReference || null,
    tags: input.tags,
    contentHash: questionHash(input.questionText, input.contextId, input.formatData),
  };

  try {
    return await prisma.$transaction(async (tx) => {
      const subtopicId = await resolveSubtopic(tx, input.topicId, input.subtopicName);

      if (!id) {
        const created = await tx.question.create({
          data: {
            ...data,
            subtopicId,
            status: "APPROVED",
            options: { create: input.options.map((text, order) => ({ text, order, isCorrect: order === input.correctIndex })) },
            relevantExams: { create: relevantExamIds.map((examId) => ({ examId })) },
          },
          select: { id: true },
        });
        return created.id;
      }

      const current = await tx.question.findUnique({
        where: { id },
        select: { sourceType: true, sourceReference: true },
      });
      if (!current) throw new AppError("That question no longer exists.");

      // A verified PYQ stays verified only while its claim is unchanged.
      const pyqClaimChanged =
        current.sourceType !== input.sourceType || (current.sourceReference ?? null) !== (input.sourceReference || null);

      await tx.question.update({
        where: { id },
        data: {
          ...data,
          subtopicId,
          ...(pyqClaimChanged ? { pyqVerifiedAt: null, pyqVerifiedById: null } : {}),
        },
      });
      // Options are updated in place so past answers keep pointing at real rows.
      for (const [order, text] of input.options.entries()) {
        await tx.questionOption.upsert({
          where: { questionId_order: { questionId: id, order } },
          create: { questionId: id, order, text, isCorrect: order === input.correctIndex },
          update: { text, isCorrect: order === input.correctIndex },
        });
      }
      await tx.questionExam.deleteMany({ where: { questionId: id } });
      await tx.questionExam.createMany({ data: relevantExamIds.map((examId) => ({ questionId: id, examId })) });
      return id;
    });
  } catch (error) {
    if (duplicateError(error)) throw new AppError("This topic already has a question with the same text.");
    throw error;
  }
}

export async function deleteQuestion(id: string) {
  await prisma.question.delete({ where: { id } });
}

export async function setQuestionDifficulty(id: string, difficulty: Difficulty) {
  await prisma.question.update({ where: { id }, data: { difficulty } });
}

export async function reviewQuestions(ids: string[], decision: "APPROVED" | "REJECTED", reason?: string) {
  const { count } = await prisma.question.updateMany({
    where: { id: { in: ids }, status: "PENDING_REVIEW" },
    data: { status: decision, rejectionReason: decision === "REJECTED" ? reason || null : null },
  });
  return count;
}

export async function verifyPyq(adminId: string, id: string, sourceReference: string, verified: boolean) {
  const question = await prisma.question.findUnique({ where: { id }, select: { sourceType: true } });
  if (!question || question.sourceType !== "PYQ") throw new AppError("That question is not marked as a PYQ.");
  const reference = sourceReference.trim();
  if (verified && reference.length < 5) throw new AppError("Enter the source (exam, year, shift) before verifying.");
  await prisma.question.update({
    where: { id },
    data: {
      sourceReference: reference || null,
      pyqVerifiedAt: verified ? new Date() : null,
      pyqVerifiedById: verified ? adminId : null,
    },
  });
}

export const importRowsSchema = z.array(z.unknown()).min(1, "The file has no rows.").max(2000, "Import at most 2000 rows at a time.");

export type ImportRowResult =
  | { row: number; ok: true; questionText: string }
  | { row: number; ok: false; errors: string[] };

type ResolvedRow = { data: ImportRow; topicId: string; subjectId: string; examId: string; relevantExamIds: string[]; hash: string };

/** Validates every row against the schema and the catalog. Writes nothing. */
export async function validateImport(rows: unknown[]) {
  const [exams, subjects] = await Promise.all([
    prisma.exam.findMany({ select: { id: true, slug: true } }),
    prisma.subject.findMany({ select: { id: true, slug: true, topics: { select: { id: true, name: true } } } }),
  ]);
  const examBySlug = new Map(exams.map((e) => [e.slug, e.id]));
  const subjectBySlug = new Map(subjects.map((s) => [s.slug, s]));

  const results: ImportRowResult[] = [];
  const resolved: ResolvedRow[] = [];
  const seenInFile = new Set<string>();

  for (const [index, raw] of rows.entries()) {
    const row = index + 1;
    const parsed = importRowSchema.safeParse(raw);
    if (!parsed.success) {
      results.push({ row, ok: false, errors: parsed.error.issues.map((i) => `${i.path.join(".") || "row"}: ${i.message}`) });
      continue;
    }
    const data = parsed.data;
    const errors: string[] = [];
    const examId = examBySlug.get(data.examSlug);
    if (!examId) errors.push(`Unknown examSlug "${data.examSlug}".`);
    const subject = subjectBySlug.get(data.subjectSlug);
    if (!subject) errors.push(`Unknown subjectSlug "${data.subjectSlug}".`);
    const topic = subject?.topics.find((t) => t.name.toLowerCase() === data.topic.toLowerCase());
    if (subject && !topic) errors.push(`Topic "${data.topic}" is not in ${data.subjectSlug}.`);
    const relevantExamIds: string[] = [];
    for (const slug of data.relevantExamSlugs) {
      const id = examBySlug.get(slug);
      if (id) relevantExamIds.push(id);
      else errors.push(`Unknown exam "${slug}" in relevantExamSlugs.`);
    }

    const hash = questionHash(data.questionText, data.formatData);
    if (topic) {
      const fileKey = `${topic.id}:${hash}`;
      if (seenInFile.has(fileKey)) errors.push("Duplicate of an earlier row in this file.");
      seenInFile.add(fileKey);
      const existing = await prisma.question.findUnique({
        where: { topicId_contentHash: { topicId: topic.id, contentHash: hash } },
        select: { id: true },
      });
      if (existing) errors.push("This topic already has a question with the same text.");
    }

    if (errors.length > 0 || !examId || !subject || !topic) {
      results.push({ row, ok: false, errors });
      continue;
    }
    results.push({ row, ok: true, questionText: data.questionText });
    resolved.push({ data, examId, subjectId: subject.id, topicId: topic.id, relevantExamIds, hash });
  }

  return { results, resolved };
}

/** All-or-nothing: an import with any invalid row writes nothing. */
export async function commitImport(rows: unknown[]) {
  const { results, resolved } = await validateImport(rows);
  const invalid = results.filter((r) => !r.ok).length;
  if (invalid > 0) throw new AppError(`${invalid} row(s) have errors. Fix them and import again.`);

  await prisma.$transaction(
    async (tx) => {
      for (const row of resolved) {
        const subtopicId = await resolveSubtopic(tx, row.topicId, row.data.subtopic);
        await tx.question.create({
          data: {
            examId: row.examId,
            subjectId: row.subjectId,
            topicId: row.topicId,
            subtopicId,
            questionText: row.data.questionText,
            format: row.data.format,
            formatData: row.data.formatData ?? Prisma.DbNull,
            explanation: row.data.explanation,
            difficulty: row.data.difficulty,
            sourceType: row.data.sourceType,
            sourceReference: row.data.sourceReference,
            tags: row.data.tags,
            status: "APPROVED",
            contentHash: row.hash,
            options: {
              create: row.data.options.map((text, order) => ({ text, order, isCorrect: order === row.data.correctIndex })),
            },
            relevantExams: {
              create: [...new Set([row.examId, ...row.relevantExamIds])].map((examId) => ({ examId })),
            },
          },
        });
      }
    },
    { timeout: 120_000 },
  );
  return resolved.length;
}

export async function getBankStats() {
  const [total, bySource, byStatus, byDifficulty, bySubject, openReports, unverifiedPyq, subjects] = await Promise.all([
    prisma.question.count(),
    prisma.question.groupBy({ by: ["sourceType"], _count: { _all: true } }),
    prisma.question.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.question.groupBy({ by: ["difficulty"], where: { status: "APPROVED" }, _count: { _all: true } }),
    prisma.question.groupBy({ by: ["subjectId"], where: { status: "APPROVED" }, _count: { _all: true } }),
    prisma.questionReport.count({ where: { status: "OPEN" } }),
    prisma.question.count({ where: { sourceType: "PYQ", pyqVerifiedAt: null } }),
    prisma.subject.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
  ]);
  const subjectCount = new Map(bySubject.map((row) => [row.subjectId, row._count._all]));
  return {
    total,
    openReports,
    unverifiedPyq,
    bySource: Object.fromEntries(bySource.map((r) => [r.sourceType, r._count._all])) as Partial<Record<SourceType, number>>,
    byStatus: Object.fromEntries(byStatus.map((r) => [r.status, r._count._all])) as Partial<Record<QuestionStatus, number>>,
    byDifficulty: Object.fromEntries(byDifficulty.map((r) => [r.difficulty, r._count._all])) as Partial<Record<Difficulty, number>>,
    bySubject: subjects.map((s) => ({ id: s.id, name: s.name, count: subjectCount.get(s.id) ?? 0 })),
  };
}
