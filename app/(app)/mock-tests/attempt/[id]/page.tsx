import { notFound, redirect } from "next/navigation";
import { MockRunner } from "@/features/mock-tests/mock-runner";
import { requireUserPage } from "@/lib/session";
import { getRunningAttempt } from "@/services/mock-tests";

export const metadata = { title: "Mock test" };

export default async function AttemptPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUserPage();
  const { id } = await params;
  const result = await getRunningAttempt(user.id, id);
  if (!result) notFound();
  if (result.submitted) redirect(`/mock-tests/attempt/${id}/results`);
  return <MockRunner view={result.view} />;
}
