import { Prisma } from "@prisma/client";
import { AppError } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function friendly(error: unknown, inUse: string, duplicate: string): never {
  // PostgreSQL 18 reports RESTRICT violations as 23001, which Prisma 6 does not
  // map to P2003, so the raw error has to be recognised too.
  if (error instanceof Prisma.PrismaClientUnknownRequestError && /23001|23503|foreign key/i.test(error.message)) {
    throw new AppError(inUse);
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2003") throw new AppError(inUse);
    if (error.code === "P2002") throw new AppError(duplicate);
    if (error.code === "P2025") throw new AppError("That item no longer exists.");
  }
  throw error;
}

export async function getCatalogForAdmin() {
  const [exams, subjects] = await Promise.all([
    prisma.exam.findMany({
      orderBy: { order: "asc" },
      include: {
        subjects: { select: { subjectId: true, isActive: true } },
        topics: { select: { topicId: true, isActive: true } },
        _count: { select: { primaryQuestions: true } },
      },
    }),
    prisma.subject.findMany({
      orderBy: { order: "asc" },
      include: {
        topics: { orderBy: { order: "asc" }, include: { _count: { select: { questions: true } } } },
        _count: { select: { questions: true } },
      },
    }),
  ]);
  return { exams, subjects };
}

export type AdminCatalog = Awaited<ReturnType<typeof getCatalogForAdmin>>;

export async function saveExam(id: string | null, data: { name: string; shortName: string; description?: string }) {
  try {
    if (id) {
      await prisma.exam.update({ where: { id }, data });
    } else {
      const order = await prisma.exam.count();
      await prisma.exam.create({ data: { ...data, slug: slugify(data.name), order } });
    }
  } catch (error) {
    friendly(error, "", "An exam with this name already exists.");
  }
}

export async function setExamActive(id: string, isActive: boolean) {
  await prisma.exam.update({ where: { id }, data: { isActive } });
}

export async function deleteExam(id: string) {
  try {
    await prisma.exam.delete({ where: { id } });
  } catch (error) {
    friendly(error, "This exam still owns questions. Reassign or delete them first, or deactivate the exam instead.", "");
  }
}

export async function saveSubject(id: string | null, name: string) {
  try {
    if (id) {
      await prisma.subject.update({ where: { id }, data: { name } });
    } else {
      const order = await prisma.subject.count();
      await prisma.subject.create({ data: { name, slug: slugify(name), order } });
    }
  } catch (error) {
    friendly(error, "", "A subject with this name already exists.");
  }
}

export async function deleteSubject(id: string) {
  try {
    await prisma.subject.delete({ where: { id } });
  } catch (error) {
    friendly(error, "This subject is still used by questions or an exam pattern. Remove those first.", "");
  }
}

export async function saveTopic(id: string | null, subjectId: string, name: string) {
  try {
    if (id) {
      await prisma.topic.update({ where: { id }, data: { name } });
    } else {
      const order = await prisma.topic.count({ where: { subjectId } });
      // A new topic joins every exam that offers its subject; admins can switch it off per exam.
      const exams = await prisma.examSubject.findMany({ where: { subjectId }, select: { examId: true } });
      await prisma.topic.create({
        data: {
          subjectId,
          name,
          slug: slugify(name),
          order,
          exams: { create: exams.map((e) => ({ examId: e.examId, order })) },
        },
      });
    }
  } catch (error) {
    friendly(error, "", "This subject already has a topic with that name.");
  }
}

export async function deleteTopic(id: string) {
  try {
    await prisma.topic.delete({ where: { id } });
  } catch (error) {
    friendly(error, "This topic still has questions. Move or delete them first.", "");
  }
}

export async function moveTopic(id: string, direction: "up" | "down") {
  const topic = await prisma.topic.findUnique({ where: { id }, select: { subjectId: true } });
  if (!topic) throw new AppError("That topic no longer exists.");
  const topics = await prisma.topic.findMany({
    where: { subjectId: topic.subjectId },
    orderBy: { order: "asc" },
    select: { id: true },
  });
  const from = topics.findIndex((t) => t.id === id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= topics.length) return;
  [topics[from], topics[to]] = [topics[to], topics[from]];
  await prisma.$transaction(topics.map((t, order) => prisma.topic.update({ where: { id: t.id }, data: { order } })));
}

export async function setExamSubject(examId: string, subjectId: string, enabled: boolean) {
  if (enabled) {
    await prisma.examSubject.upsert({
      where: { examId_subjectId: { examId, subjectId } },
      create: { examId, subjectId },
      update: { isActive: true },
    });
    const topics = await prisma.topic.findMany({ where: { subjectId }, select: { id: true, order: true } });
    await prisma.examTopic.createMany({
      data: topics.map((t) => ({ examId, topicId: t.id, order: t.order })),
      skipDuplicates: true,
    });
  } else {
    await prisma.examSubject.updateMany({ where: { examId, subjectId }, data: { isActive: false } });
  }
}

export async function setExamTopic(examId: string, topicId: string, enabled: boolean) {
  await prisma.examTopic.upsert({
    where: { examId_topicId: { examId, topicId } },
    create: { examId, topicId, isActive: enabled },
    update: { isActive: enabled },
  });
}

export async function getPatternsForAdmin() {
  return prisma.exam.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      subjects: { select: { subject: { select: { id: true, name: true } } } },
      patterns: {
        orderBy: { createdAt: "asc" },
        include: { sections: { orderBy: { order: "asc" } }, mockTests: { orderBy: { scalePercent: "asc" } } },
      },
    },
  });
}

export type AdminPatterns = Awaited<ReturnType<typeof getPatternsForAdmin>>;

export type PatternInput = {
  examId: string;
  name: string;
  sectionalTiming: boolean;
  compositeMinutes: number | null;
  notes?: string | null;
  sections: {
    id?: string;
    subjectId: string;
    name: string;
    questionCount: number;
    durationMinutes: number;
    marksPerQuestion: number;
    negativeMarks: number;
  }[];
};

export async function savePattern(id: string | null, input: PatternInput) {
  try {
    await prisma.$transaction(async (tx) => {
      const data = {
        name: input.name,
        sectionalTiming: input.sectionalTiming,
        compositeMinutes: input.sectionalTiming ? null : input.compositeMinutes,
        notes: input.notes || null,
      };
      const pattern = id
        ? // Editing what the exam looks like voids any earlier check of it.
          await tx.examPattern.update({ where: { id }, data: { ...data, verifiedAt: null } })
        : await tx.examPattern.create({ data: { ...data, examId: input.examId } });

      const keep = input.sections.flatMap((s) => (s.id ? [s.id] : []));
      await tx.examPatternSection.deleteMany({
        where: {
          patternId: pattern.id,
          id: { notIn: keep },
          // Sections that past attempts point at stay, so their results remain readable.
          attemptQuestions: { none: {} },
        },
      });
      for (const [order, section] of input.sections.entries()) {
        const { id: sectionId, ...fields } = section;
        if (sectionId) {
          await tx.examPatternSection.update({ where: { id: sectionId }, data: { ...fields, order } });
        } else {
          await tx.examPatternSection.create({ data: { ...fields, order, patternId: pattern.id } });
        }
      }
    });
  } catch (error) {
    friendly(error, "", "This exam already has a pattern with that name.");
  }
}

export async function setPatternVerified(id: string, verified: boolean) {
  await prisma.examPattern.update({ where: { id }, data: { verifiedAt: verified ? new Date() : null } });
}

export async function createMockTest(input: { patternId: string; title: string; description?: string; scalePercent: number }) {
  const pattern = await prisma.examPattern.findUnique({ where: { id: input.patternId }, select: { examId: true } });
  if (!pattern) throw new AppError("That pattern no longer exists.");
  await prisma.mockTest.create({ data: { ...input, examId: pattern.examId } });
}

export async function setMockActive(id: string, isActive: boolean) {
  await prisma.mockTest.update({ where: { id }, data: { isActive } });
}

export async function deleteMockTest(id: string) {
  const attempts = await prisma.mockTestAttempt.count({ where: { mockTestId: id } });
  if (attempts > 0) throw new AppError("Learners have attempted this mock test. Deactivate it instead, so their results stay.");
  await prisma.mockTest.delete({ where: { id } });
}

export async function saveContext(
  id: string | null,
  data: { type: "PASSAGE" | "DATA_SET"; title: string; content: string; table: { columns: string[]; rows: (string | number)[][] } | null },
) {
  const payload = { ...data, table: data.table ?? Prisma.DbNull };
  if (id) await prisma.questionContext.update({ where: { id }, data: payload });
  else await prisma.questionContext.create({ data: payload });
}

export async function deleteContext(id: string) {
  const linked = await prisma.question.count({ where: { contextId: id } });
  if (linked > 0) throw new AppError(`${linked} question(s) still use this. Remove them from it first.`);
  await prisma.questionContext.delete({ where: { id } });
}

export async function getOpenReports() {
  return prisma.questionReport.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "asc" },
    take: 100,
    include: {
      user: { select: { name: true } },
      question: { select: { id: true, questionText: true, topic: { select: { name: true } } } },
    },
  });
}

export async function resolveReport(id: string, status: "RESOLVED" | "DISMISSED") {
  await prisma.questionReport.update({ where: { id }, data: { status } });
}
