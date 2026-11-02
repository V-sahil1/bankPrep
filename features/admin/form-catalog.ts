import { prisma } from "@/lib/prisma";
import type { QuestionFormCatalog } from "@/features/admin/question-form";

export async function getFormCatalog(): Promise<QuestionFormCatalog> {
  const [exams, subjects, contexts] = await Promise.all([
    prisma.exam.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
    prisma.subject.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, topics: { orderBy: { order: "asc" }, select: { id: true, name: true } } },
    }),
    prisma.questionContext.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, type: true } }),
  ]);
  return { exams, subjects, contexts };
}
