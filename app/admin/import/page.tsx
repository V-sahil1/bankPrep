import { PageHeader } from "@/components/app/common";
import { ImportForm } from "@/features/admin/import-form";

export const metadata = { title: "Bulk Import" };

export default function ImportPage() {
  return (
    <>
      <PageHeader title="Bulk Import" description="Add many questions at once from a CSV or JSON file." />
      <ImportForm />
    </>
  );
}
