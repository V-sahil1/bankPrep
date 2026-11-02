import { BadgeCheck, FileText, Sparkles, UserPen } from "lucide-react";
import type { Difficulty, SourceType } from "@prisma/client";
import { cn } from "@/lib/utils";
import type { ClientContext, ClientQuestion } from "@/services/question-view";

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  EASY: "bg-success-soft text-success",
  MEDIUM: "bg-warning-soft text-warning",
  HARD: "bg-danger-soft text-danger",
  ADVANCED: "bg-accent text-accent-foreground",
};

const chip = "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap";

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <span className={cn(chip, DIFFICULTY_STYLE[difficulty])}>{difficulty[0] + difficulty.slice(1).toLowerCase()}</span>;
}

/** The label that keeps verified PYQs, AI output and samples clearly apart. */
export function SourceBadge({
  sourceType,
  pyqVerified,
  reference,
}: {
  sourceType: SourceType;
  pyqVerified?: boolean;
  reference?: string | null;
}) {
  if (sourceType === "PYQ") {
    return pyqVerified ? (
      <span className={cn(chip, "bg-accent text-accent-foreground")} title={reference ?? undefined}>
        <BadgeCheck className="size-3" aria-hidden /> Verified PYQ{reference ? ` · ${reference}` : ""}
      </span>
    ) : (
      <span className={cn(chip, "bg-warning-soft text-warning")}>Unverified PYQ</span>
    );
  }
  if (sourceType === "AI_GENERATED") {
    return (
      <span className={cn(chip, "bg-muted text-muted-foreground")}>
        <Sparkles className="size-3" aria-hidden /> AI-generated practice
      </span>
    );
  }
  if (sourceType === "ADMIN_AUTHORED" || sourceType === "PATTERN_BASED") {
    return (
      <span className={cn(chip, "bg-muted text-muted-foreground")}>
        <UserPen className="size-3" aria-hidden /> {sourceType === "PATTERN_BASED" ? "Pattern-based practice" : "Practice question"}
      </span>
    );
  }
  return (
    <span className={cn(chip, "bg-muted text-muted-foreground")}>
      <FileText className="size-3" aria-hidden /> Illustrative sample
    </span>
  );
}

function ContextBlock({ context }: { context: ClientContext }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-4 text-sm">
      <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {context.type === "DATA_SET" ? "Data set" : "Passage"} · {context.title}
      </p>
      <p className="leading-relaxed whitespace-pre-line">{context.content}</p>
      {context.table && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-sm">
            <thead>
              <tr>
                {context.table.columns.map((column) => (
                  <th key={column} scope="col" className="border-b px-3 py-1.5 text-left font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {context.table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border-b border-border/60 px-3 py-1.5 tabular-nums">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

/** The renderer adds its own labels, so drop any typed into the content ("A.", "2)", "III."). */
const stripLabel = (text: string) => text.replace(/^\s*(?:[A-Za-z]|\d+|[IVX]+)[.)]\s+/, "");

function FormatDataBlock({ data }: { data: unknown }) {
  if (!data || typeof data !== "object") return null;
  const raw = data as { statements?: string[]; assertion?: string; reason?: string; columnA?: string[]; columnB?: string[] };
  const value = {
    ...raw,
    statements: raw.statements?.map(stripLabel),
    columnA: raw.columnA?.map(stripLabel),
    columnB: raw.columnB?.map(stripLabel),
  };

  if (value.statements) {
    return (
      <ol className="space-y-1.5 text-sm">
        {value.statements.map((statement, i) => (
          <li key={i} className="flex gap-2">
            <span className="w-6 shrink-0 font-semibold text-muted-foreground">{ROMAN[i] ?? i + 1}.</span>
            <span className="whitespace-pre-line">{statement}</span>
          </li>
        ))}
      </ol>
    );
  }
  if (value.assertion) {
    return (
      <dl className="space-y-1.5 text-sm">
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-semibold text-muted-foreground">Assertion (A)</dt>
          <dd>{value.assertion}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-semibold text-muted-foreground">Reason (R)</dt>
          <dd>{value.reason}</dd>
        </div>
      </dl>
    );
  }
  if (value.columnA && value.columnB) {
    return (
      <div className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <ol className="space-y-1.5">
          {value.columnA.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="w-5 shrink-0 font-semibold text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
              {item}
            </li>
          ))}
        </ol>
        <ol className="space-y-1.5">
          {value.columnB.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="w-5 shrink-0 font-semibold text-muted-foreground">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ol>
      </div>
    );
  }
  return null;
}

/** Stem of any question format: shared passage or data, structured parts, then text. */
export function QuestionBody({ question }: { question: Pick<ClientQuestion, "context" | "formatData" | "questionText"> }) {
  return (
    <div className="space-y-4">
      {question.context && <ContextBlock context={question.context} />}
      <p className="text-[15px] leading-relaxed font-medium whitespace-pre-line">{question.questionText}</p>
      <FormatDataBlock data={question.formatData} />
    </div>
  );
}

export const OPTION_LETTERS = ["A", "B", "C", "D"];

/** An answered option as shown in reviews, notebooks and results. */
export function ReviewOptions({
  options,
  correctOptionId,
  selectedOptionId,
}: {
  options: { id: string; text: string }[];
  correctOptionId: string | null;
  selectedOptionId: string | null;
}) {
  return (
    <ul className="space-y-1.5">
      {options.map((option, i) => {
        const isCorrect = option.id === correctOptionId;
        const isSelected = option.id === selectedOptionId;
        return (
          <li
            key={option.id}
            className={cn(
              "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
              isCorrect && "border-success/50 bg-success-soft",
              isSelected && !isCorrect && "border-danger/50 bg-danger-soft",
            )}
          >
            <span className="font-semibold text-muted-foreground">{OPTION_LETTERS[i]}</span>
            <span className="min-w-0 flex-1 whitespace-pre-line">{option.text}</span>
            {isCorrect && <span className="text-xs font-medium text-success">Correct answer</span>}
            {isSelected && !isCorrect && <span className="text-xs font-medium text-danger">Your answer</span>}
            {isSelected && isCorrect && <span className="sr-only">Your answer</span>}
          </li>
        );
      })}
    </ul>
  );
}
