import { PageHeader } from "@/components/app/common";
import { PatternManager } from "@/features/admin/pattern-manager";
import { getPatternsForAdmin } from "@/services/catalog-admin";

export const metadata = { title: "Exam Patterns" };

export default async function PatternsPage() {
  const exams = await getPatternsForAdmin();
  return (
    <>
      <PageHeader
        title="Exam Patterns"
        description="Sections, timing and marking for each exam. Seeded patterns are unverified starting points: check them against the current official notification, then mark them verified."
      />
      <PatternManager exams={exams} />
    </>
  );
}
