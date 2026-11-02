import { PageHeader } from "@/components/app/common";
import { getFormCatalog } from "@/features/admin/form-catalog";
import { QuestionForm } from "@/features/admin/question-form";

export const metadata = { title: "Add question" };

export default async function NewQuestionPage() {
  const catalog = await getFormCatalog();
  return (
    <>
      <PageHeader title="Add question" />
      <QuestionForm catalog={catalog} />
    </>
  );
}
