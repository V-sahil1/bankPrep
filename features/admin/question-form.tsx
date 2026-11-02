"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, NativeSelect, Panel, PanelTitle } from "@/components/app/common";
import { saveQuestionAction } from "@/features/admin/actions";
import { useAction } from "@/hooks/use-action";

export type QuestionFormCatalog = {
  exams: { id: string; name: string }[];
  subjects: { id: string; name: string; topics: { id: string; name: string }[] }[];
  contexts: { id: string; title: string; type: string }[];
};

export type QuestionFormInitial = {
  id: string;
  examId: string;
  subjectId: string;
  topicId: string;
  subtopicName: string;
  relevantExamIds: string[];
  contextId: string | null;
  format: string;
  formatData: { statements?: string[]; assertion?: string; reason?: string; columnA?: string[]; columnB?: string[] } | null;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: string;
  sourceType: string;
  sourceReference: string;
  tags: string[];
};

const FORMATS = [
  ["MCQ", "Standard MCQ"],
  ["MULTIPLE_STATEMENTS", "Multiple statements"],
  ["ASSERTION_REASON", "Assertion and reason"],
  ["MATCH_THE_FOLLOWING", "Match the following"],
  ["PASSAGE", "Passage-based"],
  ["DATA_INTERPRETATION", "Data interpretation"],
];

const lines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export function QuestionForm({ catalog, initial }: { catalog: QuestionFormCatalog; initial?: QuestionFormInitial }) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [examId, setExamId] = useState(initial?.examId ?? "");
  const [subjectId, setSubjectId] = useState(initial?.subjectId ?? "");
  const [topicId, setTopicId] = useState(initial?.topicId ?? "");
  const [relevant, setRelevant] = useState<string[]>(initial?.relevantExamIds ?? []);
  const [format, setFormat] = useState(initial?.format ?? "MCQ");
  const [sourceType, setSourceType] = useState(initial?.sourceType ?? "ADMIN_AUTHORED");
  const [options, setOptions] = useState<string[]>(initial?.options ?? ["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(initial?.correctIndex ?? 0);

  const topics = useMemo(() => catalog.subjects.find((s) => s.id === subjectId)?.topics ?? [], [catalog.subjects, subjectId]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const get = (key: string) => String(form.get(key) ?? "");

    let formatData: unknown = null;
    if (format === "MULTIPLE_STATEMENTS") formatData = { statements: lines(get("statements")) };
    if (format === "ASSERTION_REASON") formatData = { assertion: get("assertion"), reason: get("reason") };
    if (format === "MATCH_THE_FOLLOWING") formatData = { columnA: lines(get("columnA")), columnB: lines(get("columnB")) };

    setErrors({});
    run(
      () =>
        saveQuestionAction(initial?.id ?? null, {
          examId,
          subjectId,
          topicId,
          subtopicName: get("subtopic") || undefined,
          relevantExamIds: relevant,
          contextId: get("contextId") || null,
          format,
          formatData,
          questionText: get("questionText"),
          options,
          correctIndex,
          explanation: get("explanation"),
          difficulty: get("difficulty"),
          sourceType,
          sourceReference: get("sourceReference") || null,
          tags: get("tags")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      {
        success: initial ? "Question updated." : "Question added.",
        onSuccess: () => router.push("/admin/questions"),
        onError: (_error, fieldErrors) => setErrors(fieldErrors ?? {}),
      },
    );
  }

  const data = initial?.formatData ?? null;

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <Panel>
        <PanelTitle>Where it belongs</PanelTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary exam" htmlFor="examId" error={errors.examId}>
            <NativeSelect id="examId" value={examId} onChange={(e) => setExamId(e.target.value)}>
              <option value="">Select an exam</option>
              {catalog.exams.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Subject" htmlFor="subjectId" error={errors.subjectId}>
            <NativeSelect
              id="subjectId"
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
                setTopicId("");
              }}
            >
              <option value="">Select a subject</option>
              {catalog.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Topic" htmlFor="topicId" error={errors.topicId}>
            <NativeSelect id="topicId" value={topicId} onChange={(e) => setTopicId(e.target.value)} disabled={!subjectId}>
              <option value="">Select a topic</option>
              {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Subtopic (optional)" htmlFor="subtopic">
            <Input id="subtopic" name="subtopic" defaultValue={initial?.subtopicName} />
          </Field>
        </div>
        <fieldset className="mt-4">
          <legend className="mb-1.5 text-sm font-medium">Also relevant to</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {catalog.exams
              .filter((e) => e.id !== examId)
              .map((e) => (
                <label key={e.id} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--primary)]"
                    checked={relevant.includes(e.id)}
                    onChange={(event) =>
                      setRelevant((current) => (event.target.checked ? [...current, e.id] : current.filter((x) => x !== e.id)))
                    }
                  />
                  {e.name}
                </label>
              ))}
          </div>
        </fieldset>
      </Panel>

      <Panel>
        <PanelTitle>Question</PanelTitle>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Format" htmlFor="format">
              <NativeSelect id="format" value={format} onChange={(e) => setFormat(e.target.value)}>
                {FORMATS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </NativeSelect>
            </Field>
            <Field label="Difficulty" htmlFor="difficulty" error={errors.difficulty}>
              <NativeSelect id="difficulty" name="difficulty" defaultValue={initial?.difficulty ?? "MEDIUM"}>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </NativeSelect>
            </Field>
            <Field label="Shared passage or data set" htmlFor="contextId" hint="Link several questions to one.">
              <NativeSelect id="contextId" name="contextId" defaultValue={initial?.contextId ?? ""}>
                <option value="">None</option>
                {catalog.contexts.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </NativeSelect>
            </Field>
          </div>

          <Field label="Question text" htmlFor="questionText" error={errors.questionText}>
            <Textarea id="questionText" name="questionText" rows={3} defaultValue={initial?.questionText} required />
          </Field>

          {format === "MULTIPLE_STATEMENTS" && (
            <Field label="Statements (one per line)" htmlFor="statements" error={errors["formatData.statements"] ?? errors.formatData}>
              <Textarea id="statements" name="statements" rows={4} defaultValue={data?.statements?.join("\n")} />
            </Field>
          )}
          {format === "ASSERTION_REASON" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Assertion" htmlFor="assertion" error={errors.formatData}>
                <Textarea id="assertion" name="assertion" rows={2} defaultValue={data?.assertion} />
              </Field>
              <Field label="Reason" htmlFor="reason">
                <Textarea id="reason" name="reason" rows={2} defaultValue={data?.reason} />
              </Field>
            </div>
          )}
          {format === "MATCH_THE_FOLLOWING" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Column A (one per line)" htmlFor="columnA" error={errors.formatData}>
                <Textarea id="columnA" name="columnA" rows={4} defaultValue={data?.columnA?.join("\n")} />
              </Field>
              <Field label="Column B (one per line)" htmlFor="columnB">
                <Textarea id="columnB" name="columnB" rows={4} defaultValue={data?.columnB?.join("\n")} />
              </Field>
            </div>
          )}

          <fieldset>
            <legend className="mb-1.5 text-sm font-medium">Options (select the correct one)</legend>
            <div className="space-y-2">
              {options.map((option, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    aria-label={`Option ${String.fromCharCode(65 + i)} is correct`}
                    className="size-4 accent-[var(--primary)]"
                    checked={correctIndex === i}
                    onChange={() => setCorrectIndex(i)}
                  />
                  <Input
                    aria-label={`Option ${String.fromCharCode(65 + i)}`}
                    value={option}
                    onChange={(e) => setOptions((all) => all.map((o, j) => (j === i ? e.target.value : o)))}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    required
                  />
                </div>
              ))}
            </div>
            {(errors.options || errors["options.0"]) && (
              <p role="alert" className="mt-1.5 text-xs text-danger">
                {(errors.options ?? errors["options.0"])[0]}
              </p>
            )}
          </fieldset>

          <Field label="Explanation" htmlFor="explanation" error={errors.explanation}>
            <Textarea id="explanation" name="explanation" rows={4} defaultValue={initial?.explanation} required />
          </Field>
        </div>
      </Panel>

      <Panel>
        <PanelTitle hint="A previous-year question needs a real source and only reaches learners after verification.">Source</PanelTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Source type" htmlFor="sourceType">
            <NativeSelect id="sourceType" value={sourceType} onChange={(e) => setSourceType(e.target.value)}>
              <option value="ADMIN_AUTHORED">Written by an administrator</option>
              <option value="ILLUSTRATIVE_SAMPLE">Illustrative sample</option>
              <option value="PYQ">Previous year question</option>
              {initial?.sourceType === "AI_GENERATED" && <option value="AI_GENERATED">AI-generated</option>}
            </NativeSelect>
          </Field>
          <Field
            label={sourceType === "PYQ" ? "Source reference (required)" : "Source reference (optional)"}
            htmlFor="sourceReference"
            error={errors.sourceReference}
            hint={sourceType === "PYQ" ? "For example: exam, year, shift." : undefined}
          >
            <Input id="sourceReference" name="sourceReference" defaultValue={initial?.sourceReference} />
          </Field>
          <Field label="Tags (comma separated)" htmlFor="tags">
            <Input id="tags" name="tags" defaultValue={initial?.tags.join(", ")} />
          </Field>
        </div>
      </Panel>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/questions")}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" aria-hidden />}
          {initial ? "Save changes" : "Add question"}
        </Button>
      </div>
    </form>
  );
}
