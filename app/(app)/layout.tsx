import { AppShell } from "@/components/app/app-shell";
import { requireUserPage } from "@/lib/session";
import { getShellStats } from "@/services/analytics";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUserPage();
  const stats = await getShellStats(user.id);
  return (
    <AppShell user={user} stats={stats}>
      {children}
    </AppShell>
  );
}
