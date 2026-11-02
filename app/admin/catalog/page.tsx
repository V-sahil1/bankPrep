import { PageHeader } from "@/components/app/common";
import { CatalogManager } from "@/features/admin/catalog-manager";
import { getCatalogForAdmin } from "@/services/catalog-admin";

export const metadata = { title: "Exams & Topics" };

export default async function CatalogPage() {
  const catalog = await getCatalogForAdmin();
  return (
    <>
      <PageHeader title="Exams & Topics" description="Add, rename, reorder and remove them, and choose what each exam offers." />
      <CatalogManager catalog={catalog} />
    </>
  );
}
