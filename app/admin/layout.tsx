import { AppShell } from "@/components/app/app-shell";
import { requireAdminPage } from "@/lib/session";
import { getShellStats } from "@/services/analytics";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminPage();
  const stats = await getShellStats(user.id);
  return (
    <AppShell variant="admin" user={user} stats={stats}>
      {children}
    </AppShell>
  );
}
