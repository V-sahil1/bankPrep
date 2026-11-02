import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Enter a valid email address.");
const password = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password must be 72 characters or fewer.");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email,
  password,
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  dailyTarget: z.coerce.number().int().min(1, "Target must be at least 1.").max(500, "Target must be 500 or fewer."),
  preferredExamId: z.string().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: password,
});
