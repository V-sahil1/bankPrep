"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, LinkButton, NativeSelect, Panel, PanelTitle } from "@/components/app/common";
import { generateQuestionsAction } from "@/features/admin/actions";
import { useAction } from "@/hooks/use-action";
import type { QuestionFormCatalog } from "@/features/admin/question-form";

export function AIGenerator({ catalog, configured }: { catalog: QuestionFormCatalog; configured: boolean }) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [examId, setExamId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [count, setCount] = useState("5");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [outcome, setOutcome] = useState<{ generated: number; duplicates: number; invalid: number } | null>(null);

  const topics = useMemo(() => catalog.subjects.find((s) => s.id === subjectId)?.topics ?? [], [catalog.subjects, subjectId]);

  function generate(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setOutcome(null);
    run(() => generateQuestionsAction({ examId, subjectId, topicId, difficulty, count }), {
      onSuccess: (result) => {
        setOutcome(result);
        router.refresh();
      },
      onError: (_error, fieldErrors) => setErrors(fieldErrors ?? {}),
    });
  }

  return (
    <Panel>
      <PanelTitle hint="Generated questions go to the review queue, labelled as AI-generated. They never count as previous-year questions.">Generate questions</PanelTitle>
      {!configured && (
        <p className="mb-4 rounded-lg border border-warning/40 bg-warning-soft px-3 py-2 text-sm text-warning" role="status">
          AI generation is off because <code>GEMINI_API_KEY</code> is not set on the server. Everything else in BankPrep works without it.
        </p>
      )}
      <form onSubmit={generate} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Exam" htmlFor="ai-exam" error={errors.examId}>
            <NativeSelect id="ai-exam" value={examId} onChange={(e) => setExamId(e.target.value)}>
              <option value="">Select</option>
              {catalog.exams.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Subject" htmlFor="ai-subject" error={errors.subjectId}>
            <NativeSelect
              id="ai-subject"
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
                setTopicId("");
              }}
            >
              <option value="">Select</option>
              {catalog.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Topic" htmlFor="ai-topic" error={errors.topicId}>
            <NativeSelect id="ai-topic" value={topicId} disabled={!subjectId} onChange={(e) => setTopicId(e.target.value)}>
              <option value="">Select</option>
              {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Difficulty" htmlFor="ai-difficulty">
            <NativeSelect id="ai-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </NativeSelect>
          </Field>
          <Field label="Questions (1 to 20)" htmlFor="ai-count" error={errors.count}>
            <Input id="ai-count" type="number" min={1} max={20} value={count} onChange={(e) => setCount(e.target.value)} />
          </Field>
        </div>
        <Button type="submit" disabled={pending || !configured}>
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Sparkles aria-hidden />}
          {pending ? "Generating, this can take a minute..." : "Generate"}
        </Button>
      </form>
      {outcome && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm" role="status">
          <span>
            {outcome.generated} ready for review · {outcome.duplicates} duplicates dropped · {outcome.invalid} failed validation
          </span>
          <LinkButton href="/admin/review" size="sm" variant="outline">Review now</LinkButton>
        </div>
      )}
    </Panel>
  );
}
