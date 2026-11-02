import { notFound, redirect } from "next/navigation";
import { SessionRunner } from "@/features/practice/session-runner";
import { requireUserPage } from "@/lib/session";
import { getSessionView } from "@/services/practice";

export const metadata = { title: "Practice session" };

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUserPage();
  const { id } = await params;
  const session = await getSessionView(user.id, id);
  if (!session) notFound();
  if (session.status !== "IN_PROGRESS") redirect(`/practice/session/${id}/results`);
  return <SessionRunner session={session} />;
}
