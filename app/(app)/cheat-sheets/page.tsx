import { ScrollText } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/app/common";
import { CheatSheetsView } from "@/features/cheat-sheets/cheat-sheets-view";
import { requireUserPage } from "@/lib/session";
import { getCheatSheets } from "@/services/cheat-sheets";

export const metadata = { title: "Cheat Sheets" };

export default async function CheatSheetsPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  await requireUserPage();
  const { topic } = await searchParams;
  const sheets = await getCheatSheets();

  return (
    <>
      <PageHeader
        eyebrow="Quick revision"
        title="Cheat Sheets"
        description="Every topic's formulas, key rules, shortcuts and common mistakes in one place."
      />
      {sheets.length === 0 ? (
        <EmptyState icon={ScrollText} title="No cheat sheets yet" description="An administrator needs to add topic notes or formulas." />
      ) : (
        <CheatSheetsView key={topic ?? ""} sheets={sheets} initialTopic={topic} />
      )}
    </>
  );
}
