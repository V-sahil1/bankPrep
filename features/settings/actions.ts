"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AppError, runAction } from "@/lib/actions";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { changePasswordSchema, loginSchema, profileSchema, registerSchema } from "@/validations/auth";

export async function loginAction(input: unknown) {
  return runAction(async () => {
    const { email, password } = loginSchema.parse(input);
    try {
      await signIn("credentials", { email, password, redirect: false });
    } catch (error) {
      if (error instanceof AuthError) throw new AppError("Incorrect email or password.");
      throw error;
    }
  });
}

export async function registerAction(input: unknown) {
  return runAction(async () => {
    const { name, email, password } = registerSchema.parse(input);
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) throw new AppError("An account with this email already exists. Sign in instead.");
    await prisma.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 10) } });
    await signIn("credentials", { email, password, redirect: false });
  });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function updateProfileAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    const data = profileSchema.parse(input);
    if (data.preferredExamId) {
      const exam = await prisma.exam.findUnique({ where: { id: data.preferredExamId }, select: { id: true } });
      if (!exam) throw new AppError("That exam no longer exists.");
    }
    await prisma.user.update({ where: { id: user.id }, data });
    revalidatePath("/", "layout");
  });
}

/** The exam switcher in the top bar. */
export async function setPreferredExamAction(examId: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    const id = z.string().nullable().parse(examId || null);
    if (id) {
      const exam = await prisma.exam.findFirst({ where: { id, isActive: true }, select: { id: true } });
      if (!exam) throw new AppError("That exam is not available.");
    }
    await prisma.user.update({ where: { id: user.id }, data: { preferredExamId: id } });
    revalidatePath("/", "layout");
  });
}

export async function changePasswordAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    const { currentPassword, newPassword } = changePasswordSchema.parse(input);
    const account = await prisma.user.findUniqueOrThrow({ where: { id: user.id }, select: { passwordHash: true } });
    if (!(await bcrypt.compare(currentPassword, account.passwordHash))) {
      throw new AppError("Your current password is incorrect.");
    }
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(newPassword, 10) } });
  });
}

/** Clears the signed-in user's own practice data. Questions and the account stay. */
export async function resetProgressAction() {
  return runAction(async () => {
    const user = await requireUser();
    await prisma.$transaction([
      prisma.userAnswer.deleteMany({ where: { userId: user.id } }),
      prisma.practiceSession.deleteMany({ where: { userId: user.id } }),
      prisma.mockTestAttempt.deleteMany({ where: { userId: user.id } }),
      prisma.mistake.deleteMany({ where: { userId: user.id } }),
      prisma.dailyActivity.deleteMany({ where: { userId: user.id } }),
    ]);
    revalidatePath("/", "layout");
  });
}
