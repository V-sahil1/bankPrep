"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Field, NativeSelect, Panel, PanelTitle } from "@/components/app/common";
import { ConfirmButton } from "@/components/app/confirm-button";
import {
  deleteExamAction,
  deleteSubjectAction,
  deleteTopicAction,
  moveTopicAction,
  saveExamAction,
  saveSubjectAction,
  saveTopicAction,
  setExamActiveAction,
  setExamSubjectAction,
  setExamTopicAction,
} from "@/features/admin/actions";
import { useAction } from "@/hooks/use-action";
import type { AdminCatalog } from "@/services/catalog-admin";

type Editor =
  | { kind: "exam"; id: string | null; name: string; shortName: string; description: string }
  | { kind: "subject"; id: string | null; name: string }
  | { kind: "topic"; id: string | null; subjectId: string; name: string };

export function CatalogManager({ catalog }: { catalog: AdminCatalog }) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [configExamId, setConfigExamId] = useState(catalog.exams[0]?.id ?? "");
  const configExam = catalog.exams.find((e) => e.id === configExamId);

  const after = { onSuccess: () => router.refresh() };

  function saveEditor(event: React.FormEvent) {
    event.preventDefault();
    if (!editor) return;
    const current = editor;
    setErrors({});
    run(
      () => {
        if (current.kind === "exam") {
          const { name, shortName, description } = current;
          return saveExamAction(current.id, { name, shortName, description });
        }
        if (current.kind === "subject") return saveSubjectAction(current.id, { name: current.name });
        return saveTopicAction(current.id, current.subjectId, { name: current.name });
      },
      {
        success: "Saved.",
        onSuccess: () => {
          setEditor(null);
          router.refresh();
        },
        onError: (_error, fieldErrors) => setErrors(fieldErrors ?? {}),
      },
    );
  }

  const examSubject = (subjectId: string) => configExam?.subjects.find((s) => s.subjectId === subjectId);
  const examTopic = (topicId: string) => configExam?.topics.find((t) => t.topicId === topicId);

  return (
    <div className="space-y-6">
      <Panel>
        <div className="mb-4 flex items-center justify-between gap-3">
          <PanelTitle hint="Inactive exams are hidden from learners but keep their data.">Examinations</PanelTitle>
          <Button size="sm" onClick={() => setEditor({ kind: "exam", id: null, name: "", shortName: "", description: "" })}>
            <Plus aria-hidden /> Add exam
          </Button>
        </div>
        <ul className="divide-y">
          {catalog.exams.map((exam) => (
            <li key={exam.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5 text-sm">
              <span className="min-w-0">
                <span className="block font-medium">{exam.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {exam.topics.filter((t) => t.isActive).length} topics · {exam._count.primaryQuestions} questions
                </span>
              </span>
              <span className="flex items-center gap-1">
                <label className="mr-2 flex items-center gap-2 text-xs text-muted-foreground">
                  Active
                  <Switch
                    checked={exam.isActive}
                    disabled={pending}
                    onCheckedChange={(checked) => run(() => setExamActiveAction(exam.id, checked), after)}
                  />
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${exam.name}`}
                  onClick={() => setEditor({ kind: "exam", id: exam.id, name: exam.name, shortName: exam.shortName, description: exam.description ?? "" })}
                >
                  <Pencil aria-hidden />
                </Button>
                <ConfirmButton
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${exam.name}`}
                  disabled={pending}
                  title={`Delete ${exam.name}?`}
                  description="This removes its configuration, patterns and mock tests. It is refused while the exam still owns questions."
                  confirmLabel="Delete exam"
                  onConfirm={() => run(() => deleteExamAction(exam.id), { success: "Exam deleted.", ...after })}
                >
                  <Trash2 aria-hidden />
                </ConfirmButton>
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <PanelTitle hint="Switches control what this exam offers. Subjects and topics themselves are shared.">Subjects and topics</PanelTitle>
          <div className="flex flex-wrap items-end gap-2">
            <Field label="Configure for" htmlFor="config-exam">
              <NativeSelect id="config-exam" value={configExamId} onChange={(e) => setConfigExamId(e.target.value)} className="w-52">
                {catalog.exams.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </NativeSelect>
            </Field>
            <Button size="sm" className="h-9" onClick={() => setEditor({ kind: "subject", id: null, name: "" })}>
              <Plus aria-hidden /> Add subject
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {catalog.subjects.map((subject) => {
            const subjectOn = Boolean(examSubject(subject.id)?.isActive);
            return (
              <details key={subject.id} className="rounded-lg border">
                <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium">
                  <span>
                    {subject.name}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {subject.topics.length} topics · {subject._count.questions} questions
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <label className="mr-2 flex items-center gap-2 text-xs font-normal text-muted-foreground">
                      In {configExam?.shortName}
                      <Switch
                        checked={subjectOn}
                        disabled={pending}
                        onCheckedChange={(checked) => run(() => setExamSubjectAction(configExamId, subject.id, checked), after)}
                      />
                    </label>
                    <Button variant="ghost" size="icon" aria-label={`Rename ${subject.name}`} onClick={() => setEditor({ kind: "subject", id: subject.id, name: subject.name })}>
                      <Pencil aria-hidden />
                    </Button>
                    <ConfirmButton
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${subject.name}`}
                      disabled={pending}
                      title={`Delete ${subject.name}?`}
                      description="This is refused while questions or exam patterns use it."
                      confirmLabel="Delete subject"
                      onConfirm={() => run(() => deleteSubjectAction(subject.id), { success: "Subject deleted.", ...after })}
                    >
                      <Trash2 aria-hidden />
                    </ConfirmButton>
                  </span>
                </summary>
                <ul className="divide-y border-t px-3">
                  {subject.topics.map((topic, i) => (
                    <li key={topic.id} className="flex flex-wrap items-center justify-between gap-2 py-1.5 text-sm">
                      <span>
                        {topic.name} <span className="text-xs text-muted-foreground tabular-nums">({topic._count.questions})</span>
                      </span>
                      <span className="flex items-center gap-0.5">
                        <label className="mr-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="sr-only">{topic.name} in {configExam?.shortName}</span>
                          <Switch
                            checked={Boolean(examTopic(topic.id)?.isActive)}
                            disabled={pending || !subjectOn}
                            onCheckedChange={(checked) => run(() => setExamTopicAction(configExamId, topic.id, checked), after)}
                          />
                        </label>
                        <Button variant="ghost" size="icon" aria-label={`Move ${topic.name} up`} disabled={pending || i === 0} onClick={() => run(() => moveTopicAction(topic.id, "up"), after)}>
                          <ArrowUp aria-hidden />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label={`Move ${topic.name} down`} disabled={pending || i === subject.topics.length - 1} onClick={() => run(() => moveTopicAction(topic.id, "down"), after)}>
                          <ArrowDown aria-hidden />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label={`Rename ${topic.name}`} onClick={() => setEditor({ kind: "topic", id: topic.id, subjectId: subject.id, name: topic.name })}>
                          <Pencil aria-hidden />
                        </Button>
                        <ConfirmButton
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${topic.name}`}
                          disabled={pending}
                          title={`Delete ${topic.name}?`}
                          description="This is refused while the topic still has questions."
                          confirmLabel="Delete topic"
                          onConfirm={() => run(() => deleteTopicAction(topic.id), { success: "Topic deleted.", ...after })}
                        >
                          <Trash2 aria-hidden />
                        </ConfirmButton>
                      </span>
                    </li>
                  ))}
                  <li className="py-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditor({ kind: "topic", id: null, subjectId: subject.id, name: "" })}>
                      <Plus aria-hidden /> Add topic
                    </Button>
                  </li>
                </ul>
              </details>
            );
          })}
        </div>
      </Panel>

      <Dialog open={editor !== null} onOpenChange={(open) => { if (!open) setEditor(null); }}>
        <DialogContent>
          {editor && (
            <form onSubmit={saveEditor} noValidate className="space-y-4">
              <DialogHeader>
                <DialogTitle>
                  {editor.id ? "Edit" : "Add"} {editor.kind}
                </DialogTitle>
              </DialogHeader>
              <Field label="Name" htmlFor="editor-name" error={errors.name}>
                <Input id="editor-name" value={editor.name} autoFocus onChange={(e) => setEditor({ ...editor, name: e.target.value })} />
              </Field>
              {editor.kind === "exam" && (
                <>
                  <Field label="Short name" htmlFor="editor-short" error={errors.shortName}>
                    <Input id="editor-short" value={editor.shortName} onChange={(e) => setEditor({ ...editor, shortName: e.target.value })} />
                  </Field>
                  <Field label="Description" htmlFor="editor-description">
                    <Input id="editor-description" value={editor.description} onChange={(e) => setEditor({ ...editor, description: e.target.value })} />
                  </Field>
                </>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditor(null)}>Cancel</Button>
                <Button type="submit" disabled={pending}>
                  {pending && <Loader2 className="animate-spin" aria-hidden />} Save
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
