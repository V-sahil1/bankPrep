"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { NativeSelect } from "@/components/app/common";
import { ConfirmButton } from "@/components/app/confirm-button";
import { SourceBadge } from "@/components/app/question-parts";
import { deleteQuestionAction, setDifficultyAction } from "@/features/admin/actions";
import { useAction } from "@/hooks/use-action";
import type { Difficulty, QuestionStatus, SourceType } from "@prisma/client";

export type QuestionRow = {
  id: string;
  questionText: string;
  difficulty: Difficulty;
  sourceType: SourceType;
  sourceReference: string | null;
  pyqVerified: boolean;
  status: QuestionStatus;
  topicName: string;
  subjectName: string;
  examName: string;
};

const STATUS_LABEL: Record<QuestionStatus, string> = {
  DRAFT: "Draft",
  APPROVED: "Live",
  PENDING_REVIEW: "In review",
  REJECTED: "Rejected",
  ARCHIVED: "Archived",
};

export function QuestionTable({ rows }: { rows: QuestionRow[] }) {
  const router = useRouter();
  const { pending, run } = useAction();

  return (
    <div className="relative overflow-x-auto rounded-xl border bg-card shadow-soft">
      <table className="w-full min-w-3xl text-sm">
        <thead className="text-xs text-muted-foreground">
          <tr className="border-b">
            <th scope="col" className="px-4 py-2 text-left font-medium">Question</th>
            <th scope="col" className="px-4 py-2 text-left font-medium">Source</th>
            <th scope="col" className="px-4 py-2 text-left font-medium">Status</th>
            <th scope="col" className="px-4 py-2 text-left font-medium">Difficulty</th>
            <th scope="col" className="px-4 py-2 text-right font-medium"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b last:border-0">
              <td className="max-w-md px-4 py-2.5">
                <p className="line-clamp-2">{row.questionText}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{row.examName} · {row.subjectName} · {row.topicName}</p>
              </td>
              <td className="px-4 py-2.5">
                <SourceBadge sourceType={row.sourceType} pyqVerified={row.pyqVerified} />
              </td>
              <td className="px-4 py-2.5 whitespace-nowrap text-xs">{STATUS_LABEL[row.status]}</td>
              <td className="px-4 py-2.5">
                <NativeSelect
                  aria-label="Difficulty"
                  defaultValue={row.difficulty}
                  disabled={pending}
                  className="h-8 w-28 text-xs"
                  onChange={(e) => {
                    const difficulty = e.target.value;
                    run(() => setDifficultyAction(row.id, difficulty), { success: "Difficulty updated." });
                  }}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </NativeSelect>
              </td>
              <td className="px-4 py-2.5">
                <div className="flex justify-end gap-1">
                  <Link href={`/admin/questions/${row.id}`} aria-label="Edit question" className={buttonVariants({ variant: "ghost", size: "icon" })}>
                    <Pencil aria-hidden />
                  </Link>
                  <ConfirmButton
                    variant="ghost"
                    size="icon"
                    aria-label="Delete question"
                    disabled={pending}
                    title="Delete this question?"
                    description="It also disappears from learners' bookmarks, mistakes and past results. This can't be undone."
                    confirmLabel="Delete"
                    onConfirm={() =>
                      run(() => deleteQuestionAction(row.id), { success: "Question deleted.", onSuccess: () => router.refresh() })
                    }
                  >
                    <Trash2 aria-hidden />
                  </ConfirmButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
