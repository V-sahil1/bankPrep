import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, Field, LinkButton, NativeSelect, PageHeader } from "@/components/app/common";
import { QuestionTable } from "@/features/admin/question-table";
import { prisma } from "@/lib/prisma";
import { listQuestions } from "@/services/question-bank";
import { difficultySchema, sourceTypeSchema } from "@/validations/question";

export const metadata = { title: "Question Bank" };

const statusSchema = z.enum(["PENDING_REVIEW", "APPROVED", "REJECTED"]);

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const { questions, total, page, pageCount } = await listQuestions({
    search: params.q?.trim() || undefined,
    examId: params.exam || undefined,
    subjectId: params.subject || undefined,
    difficulty: difficultySchema.safeParse(params.difficulty).data,
    sourceType: sourceTypeSchema.safeParse(params.source).data,
    status: statusSchema.safeParse(params.status).data,
    page: Number(params.page) || 1,
  });
  const [exams, subjects] = await Promise.all([
    prisma.exam.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
    prisma.subject.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
  ]);

  const pageHref = (target: number) => {
    const query = new URLSearchParams(Object.entries(params).filter((e): e is [string, string] => Boolean(e[1])));
    query.set("page", String(target));
    return `/admin/questions?${query}`;
  };

  return (
    <>
      <PageHeader title="Question Bank" description={`${total} matching questions.`} actions={<LinkButton href="/admin/questions/new">Add question</LinkButton>} />
      <form className="mb-5 grid items-end gap-3 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto]">
        <Field label="Search" htmlFor="q"><Input id="q" name="q" defaultValue={params.q} placeholder="Question text" /></Field>
        <Field label="Exam" htmlFor="exam">
          <NativeSelect id="exam" name="exam" defaultValue={params.exam ?? ""}>
            <option value="">All</option>
            {exams.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </NativeSelect>
        </Field>
        <Field label="Subject" htmlFor="subject">
          <NativeSelect id="subject" name="subject" defaultValue={params.subject ?? ""}>
            <option value="">All</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </NativeSelect>
        </Field>
        <Field label="Difficulty" htmlFor="difficulty">
          <NativeSelect id="difficulty" name="difficulty" defaultValue={params.difficulty ?? ""}>
            <option value="">All</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </NativeSelect>
        </Field>
        <Field label="Source" htmlFor="source">
          <NativeSelect id="source" name="source" defaultValue={params.source ?? ""}>
            <option value="">All</option>
            <option value="ILLUSTRATIVE_SAMPLE">Samples</option>
            <option value="ADMIN_AUTHORED">Admin</option>
            <option value="AI_GENERATED">AI</option>
            <option value="PYQ">PYQ</option>
          </NativeSelect>
        </Field>
        <Field label="Status" htmlFor="status">
          <NativeSelect id="status" name="status" defaultValue={params.status ?? ""}>
            <option value="">All</option>
            <option value="APPROVED">Live</option>
            <option value="PENDING_REVIEW">In review</option>
            <option value="REJECTED">Rejected</option>
          </NativeSelect>
        </Field>
        <Button type="submit" variant="outline" className="h-9">Filter</Button>
      </form>
      {questions.length === 0 ? (
        <EmptyState icon={FileQuestion} title="No questions match" description="Try clearing a filter, or add a new question." />
      ) : (
        <QuestionTable
          key={`${page}-${questions[0]?.id}`}
          rows={questions.map((q) => ({
            id: q.id,
            questionText: q.questionText,
            difficulty: q.difficulty,
            sourceType: q.sourceType,
            sourceReference: q.sourceReference,
            pyqVerified: q.pyqVerifiedAt !== null,
            status: q.status,
            topicName: q.topic.name,
            subjectName: q.subject.name,
            examName: q.exam.shortName,
          }))}
        />
      )}
      {pageCount > 1 && (
        <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm">
          {page > 1 ? <Link className="text-primary hover:underline" href={pageHref(page - 1)}>Previous</Link> : <span />}
          <span className="text-muted-foreground tabular-nums">Page {page} of {pageCount}</span>
          {page < pageCount ? <Link className="text-primary hover:underline" href={pageHref(page + 1)}>Next</Link> : <span />}
        </nav>
      )}
    </>
  );
}
