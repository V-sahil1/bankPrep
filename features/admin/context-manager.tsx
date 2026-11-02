"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, NativeSelect, Panel, PanelTitle } from "@/components/app/common";
import { ConfirmButton } from "@/components/app/confirm-button";
import { deleteContextAction, saveContextAction } from "@/features/admin/actions";
import { useAction } from "@/hooks/use-action";

export type ContextRow = {
  id: string;
  type: "PASSAGE" | "DATA_SET";
  title: string;
  content: string;
  tableText: string;
  questionCount: number;
};

const BLANK = { id: null as string | null, type: "PASSAGE" as ContextRow["type"], title: "", content: "", tableText: "" };

export function ContextManager({ contexts }: { contexts: ContextRow[] }) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [draft, setDraft] = useState<typeof BLANK | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!draft) return;
    const { id, ...data } = draft;
    setErrors({});
    run(() => saveContextAction(id, data), {
      success: "Saved.",
      onSuccess: () => {
        setDraft(null);
        router.refresh();
      },
      onError: (_error, fieldErrors) => setErrors(fieldErrors ?? {}),
    });
  }

  return (
    <div className="space-y-6">
      {draft ? (
        <Panel>
          <PanelTitle>{draft.id ? "Edit" : "New"} passage or data set</PanelTitle>
          <form onSubmit={save} noValidate className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
              <Field label="Type" htmlFor="ctx-type">
                <NativeSelect id="ctx-type" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as ContextRow["type"] })}>
                  <option value="PASSAGE">Passage</option>
                  <option value="DATA_SET">Data set</option>
                </NativeSelect>
              </Field>
              <Field label="Title" htmlFor="ctx-title" error={errors.title}>
                <Input id="ctx-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </Field>
            </div>
            <Field label="Text" htmlFor="ctx-content" error={errors.content}>
              <Textarea id="ctx-content" rows={6} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
            </Field>
            <Field label="Table (optional)" htmlFor="ctx-table" hint="One row per line, comma separated. The first line holds the column names.">
              <Textarea id="ctx-table" rows={4} className="font-mono text-xs" value={draft.tableText} onChange={(e) => setDraft({ ...draft, tableText: e.target.value })} />
            </Field>
            <div className="flex gap-2">
              <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="animate-spin" aria-hidden />} Save
              </Button>
              <Button type="button" variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
            </div>
          </form>
        </Panel>
      ) : (
        <Button onClick={() => setDraft({ ...BLANK })}>
          <Plus aria-hidden /> New passage or data set
        </Button>
      )}

      <ul className="space-y-3">
        {contexts.map((context) => (
          <li key={context.id} className="rounded-xl border bg-card p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium">{context.title}</p>
                <p className="text-xs text-muted-foreground">
                  {context.type === "DATA_SET" ? "Data set" : "Passage"} · linked to {context.questionCount} question(s)
                </p>
              </div>
              <span className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${context.title}`}
                  onClick={() => setDraft({ id: context.id, type: context.type, title: context.title, content: context.content, tableText: context.tableText })}
                >
                  <Pencil aria-hidden />
                </Button>
                <ConfirmButton
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${context.title}`}
                  disabled={pending}
                  title={`Delete ${context.title}?`}
                  description="This is refused while questions are still linked to it."
                  confirmLabel="Delete"
                  onConfirm={() => run(() => deleteContextAction(context.id), { success: "Deleted.", onSuccess: () => router.refresh() })}
                >
                  <Trash2 aria-hidden />
                </ConfirmButton>
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{context.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
