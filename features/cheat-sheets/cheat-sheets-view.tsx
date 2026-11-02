"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpenCheck, Lightbulb, Printer, Search, Sigma, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/app/common";
import { cn } from "@/lib/utils";
import type { CheatSheet } from "@/services/cheat-sheets";

const ALL = "all";

function matches(sheet: CheatSheet, query: string) {
  const haystack = [
    sheet.topicName,
    sheet.subjectName,
    sheet.intro ?? "",
    ...sheet.rules,
    ...sheet.shortcuts,
    ...sheet.mistakes,
    ...sheet.formulas.flatMap((f) => [f.title, f.expression, f.description ?? ""]),
  ]
    .join(" ")
    .toLowerCase();
  return query.split(/\s+/).every((word) => haystack.includes(word));
}

function BulletBlock({ icon: Icon, title, items, tone }: { icon: typeof Lightbulb; title: string; items: string[]; tone?: "primary" | "danger" }) {
  if (items.length === 0) return null;
  return (
    <div
      className={cn(
        "rounded-xl p-3",
        tone === "primary" && "bg-accent/60",
        tone === "danger" && "bg-danger-soft",
      )}
    >
      <h4
        className={cn(
          "eyebrow mb-1.5 flex items-center gap-1.5",
          tone === "primary" && "text-accent-foreground",
          tone === "danger" && "text-danger",
        )}
      >
        <Icon className="size-3.5" aria-hidden /> {title}
      </h4>
      <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function SheetCard({ sheet, showSubject }: { sheet: CheatSheet; showSubject: boolean }) {
  return (
    <article id={sheet.key} className="flex scroll-mt-24 flex-col gap-3 rounded-2xl border bg-card p-5 shadow-soft break-inside-avoid">
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {showSubject && <p className="eyebrow mb-0.5 text-primary">{sheet.subjectName}</p>}
          <h3 className="text-xl leading-tight font-semibold">{sheet.topicName}</h3>
        </div>
        {sheet.formulas.length > 0 && <Chip tone="primary">{sheet.formulas.length} formulas</Chip>}
      </header>

      {sheet.intro && <p className="text-sm leading-relaxed text-muted-foreground">{sheet.intro}</p>}

      {sheet.formulas.length > 0 && (
        <div>
          <h4 className="eyebrow mb-1.5 flex items-center gap-1.5">
            <Sigma className="size-3.5" aria-hidden /> Formulas
          </h4>
          <dl className="divide-y rounded-xl border">
            {sheet.formulas.map((formula) => (
              <div key={formula.title} className="px-3 py-2">
                <dt className="text-xs font-medium text-muted-foreground">{formula.title}</dt>
                <dd className="mt-0.5 font-mono text-[13px] break-words">{formula.expression}</dd>
                {formula.description && <dd className="mt-0.5 text-xs text-muted-foreground">{formula.description}</dd>}
              </div>
            ))}
          </dl>
        </div>
      )}

      <BulletBlock icon={BookOpenCheck} title="Key rules" items={sheet.rules} />
      <BulletBlock icon={Lightbulb} title="Shortcuts" items={sheet.shortcuts} tone="primary" />
      <BulletBlock icon={TriangleAlert} title="Common mistakes" items={sheet.mistakes} tone="danger" />

      {sheet.practiceHref && (
        <Link
          href={sheet.practiceHref}
          className="mt-auto inline-flex items-center gap-1 self-start pt-1 text-sm font-semibold text-primary hover:underline print:hidden"
        >
          Practise {sheet.topicName} <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      )}
    </article>
  );
}

export function CheatSheetsView({ sheets, initialTopic }: { sheets: CheatSheet[]; initialTopic?: string }) {
  const subjects = useMemo(() => [...new Map(sheets.map((s) => [s.subjectSlug, s.subjectName])).entries()], [sheets]);
  const [subject, setSubject] = useState(ALL);
  const [query, setQuery] = useState(initialTopic ?? "");

  const term = query.trim().toLowerCase();
  const visible = sheets.filter((s) => (subject === ALL || s.subjectSlug === subject) && (!term || matches(s, term)));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-2 shadow-soft md:flex-row md:items-center print:hidden">
        <div role="group" aria-label="Subject" className="flex flex-wrap gap-1.5">
          {[[ALL, "All subjects"], ...subjects].map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={subject === value}
              onClick={() => setSubject(value)}
              className={cn(
                "h-9 rounded-full px-3.5 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                subject === value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="relative flex w-full items-center md:ml-auto md:w-72">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" aria-hidden />
          <span className="sr-only">Search cheat sheets</span>
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a topic, rule or formula"
            className="h-9 rounded-full pl-9"
          />
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 print:hidden">
        <p className="text-sm text-muted-foreground" role="status">
          {visible.length} of {sheets.length} cheat sheets
        </p>
        <Button variant="outline" size="sm" onClick={() => window.print()} disabled={visible.length === 0}>
          <Printer aria-hidden /> Print these
        </Button>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No cheat sheet matches that search. Try a shorter word.
        </p>
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-2 print:block print:space-y-4">
          {visible.map((sheet) => (
            <SheetCard key={sheet.key} sheet={sheet} showSubject={subject === ALL} />
          ))}
        </div>
      )}
    </div>
  );
}
