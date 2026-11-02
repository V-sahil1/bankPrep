import { PageHeader } from "@/components/app/common";
import { SettingsForms } from "@/features/settings/settings-forms";
import { prisma } from "@/lib/prisma";
import { requireUserPage } from "@/lib/session";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUserPage();
  const exams = await prisma.exam.findMany({ where: { isActive: true }, orderBy: { order: "asc" }, select: { id: true, name: true } });
  return (
    <>
      <PageHeader title="Settings" />
      <SettingsForms user={user} exams={exams} />
    </>
  );
}
