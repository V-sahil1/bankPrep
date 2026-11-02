"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { runAction } from "@/lib/actions";
import { requireUser } from "@/lib/session";
import * as mock from "@/services/mock-tests";

const id = z.string().min(1);

export async function startMockAction(mockTestId: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    return mock.startMockAttempt(user.id, id.parse(mockTestId));
  });
}

export async function saveMockAnswerAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    const { attemptId, questionId, optionId } = z
      .object({ attemptId: id, questionId: id, optionId: id.nullable() })
      .parse(input);
    await mock.saveMockAnswer(user.id, attemptId, questionId, optionId);
  });
}

export async function setMockFlagsAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    const { attemptId, questionId, markedForReview, visited } = z
      .object({ attemptId: id, questionId: id, markedForReview: z.boolean().optional(), visited: z.boolean().optional() })
      .parse(input);
    await mock.setMockQuestionFlags(user.id, attemptId, questionId, { markedForReview, visited });
  });
}

export async function advanceSectionAction(attemptId: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    const result = await mock.advanceSection(user.id, id.parse(attemptId));
    if (result.submitted) revalidatePath("/", "layout");
    return result;
  });
}

export async function submitMockAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    const { attemptId, auto } = z.object({ attemptId: id, auto: z.boolean().default(false) }).parse(input);
    await mock.submitAttempt(user.id, attemptId, auto);
    revalidatePath("/", "layout");
  });
}
