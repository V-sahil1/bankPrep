import { NotebookPen } from "lucide-react";
import { EmptyState, LinkButton, PageHeader } from "@/components/app/common";
import { MistakesView } from "@/features/mistakes/mistakes-view";
import { requireUserPage } from "@/lib/session";
import { getMistakes } from "@/services/notebook";

export const metadata = { title: "My Mistakes" };

export default async function MistakesPage() {
  const user = await requireUserPage();
  const mistakes = await getMistakes(user.id);
  return (
    <>
      <PageHeader title="My Mistakes" description="Every question you got wrong, with your answer, the right one, and whether you have fixed it." />
      {mistakes.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="No mistakes recorded"
          description="Wrong answers are saved here automatically so you can retry them."
          action={<LinkButton href="/practice">Start practising</LinkButton>}
        />
      ) : (
        <MistakesView mistakes={mistakes} />
      )}
    </>
  );
}
