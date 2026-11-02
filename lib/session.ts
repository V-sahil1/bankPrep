import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppError } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

// The JWT only proves who the caller is. Role and existence are re-read from the
// database, so a demotion or deleted account takes effect on the next request.
const loadCurrentUser = cache(async () => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, dailyTarget: true, preferredExamId: true },
  });
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof loadCurrentUser>>>;

/** For pages: redirects to login. */
export async function requireUserPage(): Promise<CurrentUser> {
  const user = await loadCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** For pages: anyone who is not an admin goes back to their dashboard. */
export async function requireAdminPage(): Promise<CurrentUser> {
  const user = await requireUserPage();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

/** For server actions and route handlers: throws instead of redirecting. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await loadCurrentUser();
  if (!user) throw new AppError("Your session has expired. Please sign in again.");
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new AppError("You do not have permission to do that.");
  return user;
}
