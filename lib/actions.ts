import { unstable_rethrow } from "next/navigation";
import { ZodError } from "zod";

/** An error whose message is safe to show to the user. */
export class AppError extends Error {}

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/** Runs a server action body and converts failures into a serialisable result. */
export async function runAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of error.issues) {
        const key = issue.path.join(".") || "form";
        (fieldErrors[key] ??= []).push(issue.message);
      }
      return { ok: false, error: error.issues[0]?.message ?? "Please check your input.", fieldErrors };
    }
    if (error instanceof AppError) return { ok: false, error: error.message };
    console.error(error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
