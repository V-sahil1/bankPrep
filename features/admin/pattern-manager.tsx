"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BadgeCheck, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Field, NativeSelect, Panel, PanelTitle } from "@/components/app/common";
import { ConfirmButton } from "@/components/app/confirm-button";
import {
  createMockTestAction,
  deleteMockTestAction,
  savePatternAction,
  setMockActiveAction,
  setPatternVerifiedAction,
} from "@/features/admin/actions";
import { useAction } from "@/hooks/use-action";
import type { AdminPatterns } from "@/services/catalog-admin";

type Exam = AdminPatterns[number];
type Pattern = Exam["patterns"][number];

type SectionDraft = {
  key: string;
  id?: string;
  subjectId: string;
  name: string;
  questionCount: string;
  durationMinutes: string;
  marksPerQuestion: string;
  negativeMarks: string;
};

function toDraft(section: Pattern["sections"][number]): SectionDraft {
  return {
    key: section.id,
    id: section.id,
    subjectId: section.subjectId,
    name: section.name,
    questionCount: String(section.questionCount),
    durationMinutes: String(section.durationMinutes),
    marksPerQuestion: String(section.marksPerQuestion),
    negativeMarks: String(section.negativeMarks),
  };
}

function PatternEditor({ exam, pattern, onDone }: { exam: Exam; pattern: Pattern | null; onDone?: () => void }) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [name, setName] = useState(pattern?.name ?? "");
  const [sectional, setSectional] = useState(pattern?.sectionalTiming ?? true);
  const [composite, setComposite] = useState(String(pattern?.compositeMinutes ?? ""));
  const [notes, setNotes] = useState(pattern?.notes ?? "");
  const [sections, setSections] = useState<SectionDraft[]>(pattern?.sections.map(toDraft) ?? []);

  const update = (key: string, change: Partial<SectionDraft>) =>
    setSections((all) => all.map((s) => (s.key === key ? { ...s, ...change } : s)));

  function save() {
    run(
      () =>
        savePatternAction(pattern?.id ?? null, {
          examId: exam.id,
          name,
          sectionalTiming: sectional,
          compositeMinutes: sectional ? null : composite,
          notes,
          // The schema drops the client-only `key`.
          sections,
        }),
      {
        success: "Pattern saved. It now needs verifying again.",
        onSuccess: () => {
          router.refresh();
          onDone?.();
        },
      },
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
        <Field label="Pattern name" htmlFor={`name-${pattern?.id ?? exam.id}`}>
          <Input id={`name-${pattern?.id ?? exam.id}`} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Sectional timing">
          <div className="flex h-9 items-center">
            <Switch checked={sectional} onCheckedChange={setSectional} aria-label="Sectional timing" />
          </div>
        </Field>
        {!sectional && (
          <Field label="Total minutes" htmlFor={`composite-${pattern?.id ?? exam.id}`}>
            <Input id={`composite-${pattern?.id ?? exam.id}`} type="number" className="w-24" value={composite} onChange={(e) => setComposite(e.target.value)} />
          </Field>
        )}
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-2xl text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="py-1 pr-2 text-left font-medium">Section</th>
              <th scope="col" className="py-1 pr-2 text-left font-medium">Subject</th>
              <th scope="col" className="py-1 pr-2 text-left font-medium">Questions</th>
              <th scope="col" className="py-1 pr-2 text-left font-medium">Minutes</th>
              <th scope="col" className="py-1 pr-2 text-left font-medium">Marks each</th>
              <th scope="col" className="py-1 pr-2 text-left font-medium">Negative</th>
              <th scope="col"><span className="sr-only">Remove</span></th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.key}>
                <td className="py-1 pr-2"><Input aria-label="Section name" value={section.name} onChange={(e) => update(section.key, { name: e.target.value })} /></td>
                <td className="py-1 pr-2">
                  <NativeSelect aria-label="Subject" value={section.subjectId} onChange={(e) => update(section.key, { subjectId: e.target.value })}>
                    <option value="">Select</option>
                    {exam.subjects.map(({ subject }) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                  </NativeSelect>
                </td>
                <td className="py-1 pr-2"><Input aria-label="Question count" type="number" className="w-20" value={section.questionCount} onChange={(e) => update(section.key, { questionCount: e.target.value })} /></td>
                <td className="py-1 pr-2"><Input aria-label="Minutes" type="number" className="w-20" value={section.durationMinutes} onChange={(e) => update(section.key, { durationMinutes: e.target.value })} /></td>
                <td className="py-1 pr-2"><Input aria-label="Marks per question" type="number" step="0.25" className="w-20" value={section.marksPerQuestion} onChange={(e) => update(section.key, { marksPerQuestion: e.target.value })} /></td>
                <td className="py-1 pr-2"><Input aria-label="Negative marks" type="number" step="0.05" className="w-20" value={section.negativeMarks} onChange={(e) => update(section.key, { negativeMarks: e.target.value })} /></td>
                <td className="py-1">
                  <Button variant="ghost" size="icon" aria-label={`Remove section ${section.name}`} onClick={() => setSections((all) => all.filter((s) => s.key !== section.key))}>
                    <Trash2 aria-hidden />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setSections((all) => [
            ...all,
            { key: crypto.randomUUID(), subjectId: "", name: "", questionCount: "30", durationMinutes: "20", marksPerQuestion: "1", negativeMarks: "0.25" },
          ])
        }
      >
        <Plus aria-hidden /> Add section
      </Button>
      <Field label="Notes" htmlFor={`notes-${pattern?.id ?? exam.id}`}>
        <Input id={`notes-${pattern?.id ?? exam.id}`} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>
      <Button onClick={save} disabled={pending}>
        {pending && <Loader2 className="animate-spin" aria-hidden />} Save pattern
      </Button>
    </div>
  );
}

function MockTests({ pattern }: { pattern: Pattern }) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [title, setTitle] = useState("");
  const [scale, setScale] = useState("100");
  const after = { onSuccess: () => router.refresh() };

  return (
    <div className="mt-5 border-t pt-4">
      <h4 className="mb-2 text-sm font-semibold">Mock tests on this pattern</h4>
      <ul className="mb-3 divide-y">
        {pattern.mockTests.map((test) => (
          <li key={test.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
            <span>{test.title} <span className="text-xs text-muted-foreground">({test.scalePercent}% length)</span></span>
            <span className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                Active
                <Switch checked={test.isActive} disabled={pending} onCheckedChange={(checked) => run(() => setMockActiveAction(test.id, checked), after)} />
              </label>
              <ConfirmButton
                variant="ghost"
                size="icon"
                aria-label={`Delete ${test.title}`}
                disabled={pending}
                title={`Delete ${test.title}?`}
                description="This is refused if learners have attempted it."
                confirmLabel="Delete"
                onConfirm={() => run(() => deleteMockTestAction(test.id), { success: "Mock test deleted.", ...after })}
              >
                <Trash2 aria-hidden />
              </ConfirmButton>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-end gap-2">
        <Field label="New mock title" htmlFor={`mock-${pattern.id}`}>
          <Input id={`mock-${pattern.id}`} value={title} onChange={(e) => setTitle(e.target.value)} className="w-60" />
        </Field>
        <Field label="Length %" htmlFor={`scale-${pattern.id}`}>
          <Input id={`scale-${pattern.id}`} type="number" min={5} max={100} value={scale} onChange={(e) => setScale(e.target.value)} className="w-20" />
        </Field>
        <Button
          variant="outline"
          disabled={pending}
          onClick={() =>
            run(() => createMockTestAction({ patternId: pattern.id, title, scalePercent: scale }), {
              success: "Mock test created.",
              onSuccess: () => {
                setTitle("");
                router.refresh();
              },
            })
          }
        >
          <Plus aria-hidden /> Create
        </Button>
      </div>
    </div>
  );
}

export function PatternManager({ exams }: { exams: AdminPatterns }) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [examId, setExamId] = useState(exams[0]?.id ?? "");
  const [adding, setAdding] = useState(false);
  const exam = exams.find((e) => e.id === examId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Field label="Exam" htmlFor="pattern-exam">
          <NativeSelect
            id="pattern-exam"
            value={examId}
            className="w-60"
            onChange={(e) => {
              setExamId(e.target.value);
              setAdding(false);
            }}
          >
            {exams.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </NativeSelect>
        </Field>
        <Button variant="outline" onClick={() => setAdding((a) => !a)}>
          <Plus aria-hidden /> {adding ? "Cancel new pattern" : "New pattern"}
        </Button>
      </div>

      {exam && adding && (
        <Panel>
          <PanelTitle>New pattern for {exam.name}</PanelTitle>
          <PatternEditor exam={exam} pattern={null} onDone={() => setAdding(false)} />
        </Panel>
      )}

      {exam?.patterns.map((pattern) => (
        <Panel key={pattern.id}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">{pattern.name}</h3>
            {pattern.verifiedAt ? (
              <span className="flex items-center gap-2 text-xs text-success">
                <BadgeCheck className="size-4" aria-hidden /> Verified
                <Button variant="ghost" size="sm" disabled={pending} onClick={() => run(() => setPatternVerifiedAction(pattern.id, false), { onSuccess: () => router.refresh() })}>
                  Remove
                </Button>
              </span>
            ) : (
              <ConfirmButton
                size="sm"
                variant="outline"
                destructive={false}
                disabled={pending}
                title="Mark this pattern as verified?"
                description="Learners will see it as checked. Only do this after comparing it with the current official notification."
                confirmLabel="Mark verified"
                onConfirm={() => run(() => setPatternVerifiedAction(pattern.id, true), { success: "Pattern verified.", onSuccess: () => router.refresh() })}
              >
                Mark verified
              </ConfirmButton>
            )}
          </div>
          <PatternEditor key={pattern.updatedAt.toString()} exam={exam} pattern={pattern} />
          <MockTests pattern={pattern} />
        </Panel>
      ))}
    </div>
  );
}
