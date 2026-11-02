import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app/common";
import { getFormCatalog } from "@/features/admin/form-catalog";
import { QuestionForm, type QuestionFormInitial } from "@/features/admin/question-form";
import { getQuestionForEdit } from "@/services/question-bank";

export const metadata = { title: "Edit question" };

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [question, catalog] = await Promise.all([getQuestionForEdit(id), getFormCatalog()]);
  if (!question) notFound();

  return (
    <>
      <PageHeader title="Edit question" />
      <QuestionForm
        catalog={catalog}
        initial={{
          id: question.id,
          examId: question.examId,
          subjectId: question.subjectId,
          topicId: question.topicId,
          subtopicName: question.subtopic?.name ?? "",
          relevantExamIds: question.relevantExams.map((r) => r.examId).filter((examId) => examId !== question.examId),
          contextId: question.contextId,
          format: question.format,
          formatData: question.formatData as QuestionFormInitial["formatData"],
          questionText: question.questionText,
          options: question.options.map((o) => o.text),
          correctIndex: Math.max(0, question.options.findIndex((o) => o.isCorrect)),
          explanation: question.explanation,
          difficulty: question.difficulty,
          sourceType: question.sourceType,
          sourceReference: question.sourceReference ?? "",
          tags: question.tags,
        }}
      />
    </>
  );
}
