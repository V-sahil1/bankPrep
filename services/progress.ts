import type { Prisma } from "@prisma/client";
import { dayDate } from "@/lib/dates";

export type FinalizedAnswer = {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  timeSpentSec: number;
};

/**
 * Records the side effects of answers becoming final: daily activity and the
 * mistake notebook. Must run in the same transaction that finalizes the answers.
 */
export async function applyFinalizedAnswers(
  tx: Prisma.TransactionClient,
  userId: string,
  answers: FinalizedAnswer[],
  now: Date = new Date(),
): Promise<void> {
  if (answers.length === 0) return;

  const date = dayDate(now);
  const correct = answers.filter((a) => a.isCorrect).length;
  const timeSpentSec = answers.reduce((sum, a) => sum + a.timeSpentSec, 0);
  await tx.dailyActivity.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, attempted: answers.length, correct, timeSpentSec },
    update: {
      attempted: { increment: answers.length },
      correct: { increment: correct },
      timeSpentSec: { increment: timeSpentSec },
    },
  });

  for (const answer of answers) {
    if (answer.isCorrect) {
      // A correct answer only matters here if the question is already in the notebook.
      await tx.mistake.updateMany({
        where: { userId, questionId: answer.questionId },
        data: { correctRetryCount: { increment: 1 }, isResolved: true, resolvedAt: now },
      });
    } else {
      await tx.mistake.upsert({
        where: { userId_questionId: { userId, questionId: answer.questionId } },
        create: {
          userId,
          questionId: answer.questionId,
          lastWrongOptionId: answer.selectedOptionId,
          firstWrongAt: now,
          lastWrongAt: now,
        },
        update: {
          lastWrongOptionId: answer.selectedOptionId,
          wrongCount: { increment: 1 },
          isResolved: false,
          resolvedAt: null,
          lastWrongAt: now,
        },
      });
    }
  }
}
