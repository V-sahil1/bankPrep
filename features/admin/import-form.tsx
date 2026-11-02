"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Papa from "papaparse";
import { CheckCircle2, FileUp, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Panel, PanelTitle } from "@/components/app/common";
import { commitImportAction, validateImportAction } from "@/features/admin/actions";
import { useAction } from "@/hooks/use-action";
import { cn } from "@/lib/utils";
import type { ImportRowResult } from "@/services/question-bank";
import { csvRecordToImportRow } from "@/validations/question";

const CSV_HEADER =
  "examSlug,subjectSlug,topic,subtopic,questionText,optionA,optionB,optionC,optionD,correct,explanation,difficulty,tags,relevantExamSlugs,sourceType,sourceReference";

function parseFile(name: string, text: string): unknown[] {
  if (name.toLowerCase().endsWith(".json")) {
    const data: unknown = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error("A JSON import must be an array of questions.");
    return data;
  }
  const parsed = Papa.parse<Record<string, string>>(text.replace(/^﻿/, ""), { header: true, skipEmptyLines: true });
  if (parsed.errors.length > 0) throw new Error(`CSV line ${(parsed.errors[0].row ?? 0) + 2}: ${parsed.errors[0].message}`);
  return parsed.data.map(csvRecordToImportRow);
}

export function ImportForm() {
  const router = useRouter();
  const { pending, run } = useAction();
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<unknown[] | null>(null);
  const [results, setResults] = useState<ImportRowResult[] | null>(null);

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setResults(null);
    setRows(null);
    if (!file) return;
    setFileName(file.name);
    try {
      const parsed = parseFile(file.name, await file.text());
      setRows(parsed);
      run(() => validateImportAction(parsed), { onSuccess: setResults });
    } catch (error) {
      toast.error(error instanceof SyntaxError ? "That file is not valid JSON." : (error as Error).message);
    }
  }

  const invalid = results?.filter((r) => !r.ok).length ?? 0;
  const valid = results ? results.length - invalid : 0;

  function commit() {
    if (!rows) return;
    run(() => commitImportAction(rows), {
      onSuccess: (count) => {
        toast.success(`Imported ${count} questions.`);
        setRows(null);
        setResults(null);
        setFileName("");
        router.refresh();
      },
    });
  }

  return (
    <div className="space-y-6">
      <Panel>
        <PanelTitle hint="Every row is checked first. If any row has an error, nothing is imported.">Upload a file</PanelTitle>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-8 text-center text-sm focus-within:ring-3 focus-within:ring-ring/50 hover:border-primary/50">
          <FileUp className="size-5 text-muted-foreground" aria-hidden />
          <span className="font-medium">{fileName || "Choose a CSV or JSON file"}</span>
          <input type="file" accept=".csv,.json" onChange={onFile} className="sr-only" />
        </label>
        {pending && !results && (
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground" role="status">
            <Loader2 className="size-4 animate-spin" aria-hidden /> Checking rows...
          </p>
        )}
      </Panel>

      {results && (
        <Panel>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">
              <span className="font-medium text-success">{valid} valid</span>
              {invalid > 0 && <span className="font-medium text-danger"> · {invalid} with errors</span>}
            </p>
            <Button onClick={commit} disabled={pending || invalid > 0 || valid === 0}>
              {pending && <Loader2 className="animate-spin" aria-hidden />} Import {valid} questions
            </Button>
          </div>
          <ul className="max-h-96 divide-y overflow-y-auto text-sm">
            {results.map((result) => (
              <li key={result.row} className={cn("flex gap-2 py-2", !result.ok && "text-danger")}>
                {result.ok ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-label="Valid" />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0" aria-label="Has errors" />
                )}
                <span className="w-12 shrink-0 text-muted-foreground tabular-nums">Row {result.row}</span>
                <span className="min-w-0 flex-1">
                  {result.ok ? <span className="line-clamp-1 text-foreground">{result.questionText}</span> : result.errors.join(" ")}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel>
        <PanelTitle>File format</PanelTitle>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            CSV needs this header. <code>correct</code> is A, B, C or D. Separate <code>tags</code> and <code>relevantExamSlugs</code> with <code>|</code>. Use <code>PYQ</code> as the source type only with a real <code>sourceReference</code>; it stays hidden from learners until verified.
          </p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">{CSV_HEADER}</pre>
          <p className="text-muted-foreground">
            JSON is an array of objects with <code>examSlug</code>, <code>subjectSlug</code>, <code>topic</code>, <code>questionText</code>, <code>options</code> (four strings), <code>correctIndex</code> (0 to 3), <code>explanation</code> and <code>difficulty</code>. It also accepts <code>format</code> and <code>formatData</code> for other question formats.
          </p>
        </div>
      </Panel>
    </div>
  );
}
