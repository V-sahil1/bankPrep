"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BookmarkX, Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, NativeSelect } from "@/components/app/common";
import { ConfirmButton } from "@/components/app/confirm-button";
import { DifficultyBadge, QuestionBody, ReviewOptions, SourceBadge } from "@/components/app/question-parts";
import { startListSessionAction, toggleBookmarkAction } from "@/features/practice/actions";
import { useAction } from "@/hooks/use-action";
import type { BookmarkEntry } from "@/services/notebook";

export function BookmarksView({ bookmarks }: { bookmarks: BookmarkEntry[] }) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [examId, setExamId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [removed, setRemoved] = useState<Set<string>>(new Set());

  const live = bookmarks.filter((b) => !removed.has(b.question.id));
  const exams = useMemo(() => uniq(live.map((b) => [b.examId, b.question.examName])), [live]);
  const subjects = useMemo(
    () => uniq(live.filter((b) => !examId || b.examId === examId).map((b) => [b.subjectId, b.question.subjectName])),
    [live, examId],
  );
  const topics = useMemo(
    () =>
      uniq(
        live
          .filter((b) => (!examId || b.examId === examId) && (!subjectId || b.subjectId === subjectId))
          .map((b) => [b.topicId, b.question.topicName]),
      ),
    [live, examId, subjectId],
  );
  const visible = live.filter(
    (b) => (!examId || b.examId === examId) && (!subjectId || b.subjectId === subjectId) && (!topicId || b.topicId === topicId),
  );

  const groups = new Map<string, BookmarkEntry[]>();
  for (const bookmark of visible) {
    const key = `${bookmark.question.subjectName} · ${bookmark.question.topicName}`;
    groups.set(key, [...(groups.get(key) ?? []), bookmark]);
  }

  function practise() {
    run(
      () =>
        startListSessionAction({
          source: "BOOKMARKS",
          examId: examId || undefined,
          subjectId: subjectId || undefined,
          topicId: topicId || undefined,
        }),
      { onSuccess: ({ sessionId }) => router.push(`/practice/session/${sessionId}`) },
    );
  }

  function remove(questionId: string) {
    run(() => toggleBookmarkAction(questionId), {
      onSuccess: () => {
        setRemoved((current) => new Set(current).add(questionId));
        toast.success("Bookmark removed.");
      },
    });
  }

  return (
    <div>
      <div className="mb-6 grid items-end gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <Field label="Exam" htmlFor="bm-exam">
          <NativeSelect
            id="bm-exam"
            value={examId}
            onChange={(e) => {
              setExamId(e.target.value);
              setSubjectId("");
              setTopicId("");
            }}
          >
            <option value="">All exams</option>
            {exams.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </NativeSelect>
        </Field>
        <Field label="Subject" htmlFor="bm-subject">
          <NativeSelect
            id="bm-subject"
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setTopicId("");
            }}
          >
            <option value="">All subjects</option>
            {subjects.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </NativeSelect>
        </Field>
        <Field label="Topic" htmlFor="bm-topic">
          <NativeSelect id="bm-topic" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
            <option value="">All topics</option>
            {topics.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </NativeSelect>
        </Field>
        <Button onClick={practise} disabled={pending || visible.length === 0} className="h-9">
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Play aria-hidden />} Practise {visible.length}
        </Button>
      </div>

      {visible.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No bookmarks match these filters.</p>}

      <div className="space-y-8">
        {[...groups.entries()].map(([group, entries]) => (
          <section key={group}>
            <h2 className="mb-3 text-sm font-semibold">
              {group} <span className="font-normal text-muted-foreground">({entries.length})</span>
            </h2>
            <ul className="space-y-3">
              {entries.map(({ id, question, reveal }) => (
                <li key={id} className="rounded-xl border bg-card p-5 shadow-soft">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">{question.examName}</span>
                    <DifficultyBadge difficulty={question.difficulty} />
                    <SourceBadge sourceType={question.sourceType} pyqVerified={question.pyqVerified} reference={question.sourceReference} />
                    <ConfirmButton
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      title="Remove this bookmark?"
                      description="The question stays in the bank; it just leaves your bookmarks."
                      confirmLabel="Remove"
                      disabled={pending}
                      onConfirm={() => remove(question.id)}
                    >
                      <BookmarkX aria-hidden /> Remove
                    </ConfirmButton>
                  </div>
                  <QuestionBody question={question} />
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer font-medium text-primary">Show answer and explanation</summary>
                    <div className="mt-3 space-y-3">
                      <ReviewOptions options={question.options} correctOptionId={reveal.correctOptionId} selectedOptionId={null} />
                      <p className="rounded-lg bg-muted/50 p-3 leading-relaxed whitespace-pre-line">{reveal.explanation}</p>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function uniq(pairs: string[][]): string[][] {
  return [...new Map(pairs.map(([id, name]) => [id, name])).entries()];
}
