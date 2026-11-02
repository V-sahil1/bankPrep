"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BarChart3,
  Bookmark,
  ChevronDown,
  ClipboardList,
  FileQuestion,
  Flame,
  GraduationCap,
  History,
  Landmark,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  NotebookPen,
  Play,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { setPreferredExamAction, signOutAction } from "@/features/settings/actions";
import { useAction } from "@/hooks/use-action";
import { cn } from "@/lib/utils";
import type { ShellStats } from "@/services/analytics";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/app/theme-toggle";

export type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean; badge?: number };

export type ShellUser = { name: string; email: string; role: "USER" | "ADMIN"; dailyTarget: number; preferredExamId: string | null };

const LEARNER_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/practice", label: "Practice Questions", icon: Target },
  { href: "/cheat-sheets", label: "Cheat Sheets", icon: ScrollText },
  { href: "/mock-tests", label: "Mock Tests", icon: ClipboardList },
  { href: "/pyq", label: "Previous Year Questions", icon: FileQuestion },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/mistakes", label: "My Mistakes", icon: NotebookPen },
  { href: "/analytics", label: "Performance Analytics", icon: BarChart3 },
  { href: "/history", label: "Study History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/catalog", label: "Exams & Topics", icon: ListChecks },
  { href: "/admin/patterns", label: "Exam Patterns", icon: ClipboardList },
  { href: "/admin/questions", label: "Question Bank", icon: FileQuestion },
  { href: "/admin/contexts", label: "Passages & Data Sets", icon: NotebookPen },
  { href: "/admin/import", label: "Bulk Import", icon: History },
  { href: "/admin/ai", label: "AI Generation", icon: Target },
  { href: "/admin/review", label: "AI Review", icon: ShieldCheck },
  { href: "/admin/pyq", label: "PYQ Verification", icon: Bookmark },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Landmark className="size-4" aria-hidden />
      </span>
      <span className="font-heading text-lg font-semibold tracking-wide">BankPrep</span>
    </Link>
  );
}

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {items.map(({ href, label, icon: Icon, exact, badge }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring",
                active && "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft hover:bg-sidebar-primary",
              )}
            >
              <Icon className="size-[18px] shrink-0" aria-hidden />
              <span className="flex-1 truncate">{label}</span>
              {badge ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                    active ? "bg-white/20 text-white" : "bg-danger-soft text-danger",
                  )}
                >
                  {badge} due
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarBody({
  variant,
  user,
  examName,
  dueMistakes,
  onNavigate,
}: {
  variant: "learner" | "admin";
  user: ShellUser;
  examName: string | null;
  dueMistakes: number;
  onNavigate?: () => void;
}) {
  const isAdmin = user.role === "ADMIN";
  const learnerNav = LEARNER_NAV.map((item) => (item.href === "/mistakes" ? { ...item, badge: dueMistakes } : item));
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="px-1 pt-1">
        <Brand />
      </div>
      <nav aria-label={variant === "admin" ? "Administration" : "Main"} className="flex-1 overflow-y-auto">
        {variant === "admin" && <p className="eyebrow mb-2 px-3">Admin</p>}
        <NavLinks items={variant === "admin" ? ADMIN_NAV : learnerNav} onNavigate={onNavigate} />
        {isAdmin && (
          <div className="mt-4 border-t pt-4">
            <NavLinks
              items={
                variant === "admin"
                  ? [{ href: "/dashboard", label: "Back to learner view", icon: LayoutDashboard }]
                  : [{ href: "/admin", label: "Admin panel", icon: ShieldCheck }]
              }
              onNavigate={onNavigate}
            />
          </div>
        )}
      </nav>
      <div className="rounded-2xl bg-sidebar-accent/70 p-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <UserRound className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{examName ?? "No exam selected"}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Link href="/settings" onClick={onNavigate} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
            <Settings className="size-3.5" aria-hidden /> Settings
          </Link>
          <ThemeToggle />
          <form action={signOutAction}>
            <button type="submit" className="flex items-center gap-1.5 text-xs font-medium text-danger hover:underline">
              <LogOut className="size-3.5" aria-hidden /> Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function TopBar({
  user,
  stats,
  onOpenNav,
}: {
  user: ShellUser;
  stats: ShellStats;
  onOpenNav: () => void;
}) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [query, setQuery] = useState("");
  const preferred = stats.exams.find((e) => e.id === user.preferredExamId);

  function search(event: React.FormEvent) {
    event.preventDefault();
    router.push(query.trim() ? `/practice?q=${encodeURIComponent(query.trim())}` : "/practice");
  }

  return (
    <div className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onOpenNav}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>
        <div className="lg:hidden">
          <Brand />
        </div>

        <form onSubmit={search} role="search" className="relative hidden min-w-0 flex-1 md:block md:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics"
            aria-label="Search topics"
            className="h-10 w-full rounded-full border bg-card pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
          />
        </form>

        <label className="relative hidden items-center md:flex">
          <GraduationCap className="pointer-events-none absolute left-3 size-4 text-primary" aria-hidden />
          <span className="sr-only">Target exam</span>
          <select
            value={user.preferredExamId ?? ""}
            disabled={pending}
            onChange={(e) => {
              const value = e.target.value;
              run(() => setPreferredExamAction(value || null), { onSuccess: () => router.refresh() });
            }}
            className="h-10 appearance-none rounded-full border bg-card pr-8 pl-9 text-sm font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
          >
            <option value="">Choose exam</option>
            {stats.exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" aria-hidden />
        </label>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden h-10 items-center gap-1.5 rounded-full border bg-card px-3 text-xs font-semibold tabular-nums sm:flex" title="Current streak">
            <Flame className="size-4 text-warning" aria-hidden />
            {stats.streak} day{stats.streak === 1 ? "" : "s"} streak
          </span>
          <span className="hidden h-10 items-center gap-1.5 rounded-full border bg-card px-3 text-xs font-semibold tabular-nums sm:flex" title="Today's questions">
            <Target className="size-4 text-primary" aria-hidden />
            {stats.todayAttempted}/{user.dailyTarget} today
          </span>
          <Link
            href="/practice"
            className="flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <Play className="size-4" aria-hidden /> Practice Now
          </Link>
          {preferred && <span className="sr-only">Target exam: {preferred.name}</span>}
        </div>
      </div>
    </div>
  );
}

export function AppShell({
  variant = "learner",
  user,
  stats,
  children,
}: {
  variant?: "learner" | "admin";
  user: ShellUser;
  stats: ShellStats;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const examName = stats.exams.find((e) => e.id === user.preferredExamId)?.name ?? null;
  const sidebar = <SidebarBody variant={variant} user={user} examName={examName} dueMistakes={stats.dueMistakes} />;

  return (
    <div className="min-h-screen lg:pl-72">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r bg-sidebar lg:block">{sidebar}</aside>

      <TopBar user={user} stats={stats} onOpenNav={() => setOpen(true)} />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-80 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarBody variant={variant} user={user} examName={examName} dueMistakes={stats.dueMistakes} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <main id="main" className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
