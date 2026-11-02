"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { runAction } from "@/lib/actions";
import { requireUser } from "@/lib/session";
import * as practice from "@/services/practice";
import {
  reportQuestionSchema,
  startListSessionSchema,
  startTopicSessionSchema,
  submitAnswerSchema,
} from "@/validations/practice";

export async function startTopicSessionAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    return practice.startTopicSession(user.id, startTopicSessionSchema.parse(input));
  });
}

export async function startListSessionAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    return practice.startListSession(user.id, startListSessionSchema.parse(input));
  });
}

export async function submitAnswerAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    return practice.submitAnswer(user.id, submitAnswerSchema.parse(input));
  });
}

const sessionQuestion = z.object({ sessionId: z.string().min(1), questionId: z.string().min(1) });

export async function skipQuestionAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    const { sessionId, questionId } = sessionQuestion.parse(input);
    await practice.skipQuestion(user.id, sessionId, questionId);
  });
}

export async function toggleReviewAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    const { sessionId, questionId } = sessionQuestion.parse(input);
    return practice.toggleReviewMark(user.id, sessionId, questionId);
  });
}

export async function revealQuestionAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    const { sessionId, questionId } = sessionQuestion.parse(input);
    return practice.revealQuestion(user.id, sessionId, questionId);
  });
}

export async function saveSessionPositionAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    const { sessionId, index } = z
      .object({ sessionId: z.string().min(1), index: z.number().int().min(0) })
      .parse(input);
    await practice.saveSessionPosition(user.id, sessionId, index);
  });
}

export async function finishSessionAction(sessionId: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    await practice.finishSession(user.id, z.string().min(1).parse(sessionId));
    revalidatePath("/", "layout");
  });
}

export async function abandonSessionAction(sessionId: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    await practice.abandonSession(user.id, z.string().min(1).parse(sessionId));
    revalidatePath("/", "layout");
  });
}

export async function toggleBookmarkAction(questionId: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    const bookmarked = await practice.toggleBookmark(user.id, z.string().min(1).parse(questionId));
    revalidatePath("/bookmarks");
    return bookmarked;
  });
}

export async function reportQuestionAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser();
    const { questionId, reason, details } = reportQuestionSchema.parse(input);
    await practice.reportQuestion(user.id, questionId, reason, details);
  });
}
