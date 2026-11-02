"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NativeSelect, Panel, PanelTitle } from "@/components/app/common";
import { cn } from "@/lib/utils";
import type { AnalyticsData, TopicStat } from "@/services/analytics";

const axis = { fontSize: 11, fill: "var(--muted-foreground)" };
const grid = { stroke: "var(--border)", strokeDasharray: "0", vertical: false };

const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
const monthLabel = (key: string) =>
  new Intl.DateTimeFormat("en-IN", { month: "short", year: "2-digit", timeZone: "UTC" }).format(new Date(`${key}-01T00:00:00Z`));

type Row = { label: string; lines: { name: string; value: string; color?: string }[] };

function ChartTooltip({ active, payload, describe }: Pick<TooltipContentProps<number, string>, "active" | "payload"> & { describe: (datum: never) => Row }) {
  if (!active || !payload?.length) return null;
  const row = describe(payload[0].payload as never);
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium">{row.label}</p>
      {row.lines.map((line) => (
        <p key={line.name} className="flex items-center justify-between gap-4 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            {line.color && <span className="size-2 rounded-full" style={{ background: line.color }} aria-hidden />}
            {line.name}
          </span>
          <span className="font-medium text-popover-foreground tabular-nums">{line.value}</span>
        </p>
      ))}
    </div>
  );
}

function DataTableToggle({ children }: { children: React.ReactNode }) {
  return (
    <details className="mt-3 text-xs">
      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">View as table</summary>
      <div className="mt-2 max-h-56 overflow-auto">{children}</div>
    </details>
  );
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <table className="w-full tabular-nums">
      <thead className="text-muted-foreground">
        <tr>
          {headers.map((h, i) => (
            <th key={h} scope="col" className={cn("py-1 font-medium", i === 0 ? "text-left" : "text-right")}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-t border-border/60">
            {row.map((cell, j) => (
              <td key={j} className={cn("py-1", j === 0 ? "text-left" : "text-right")}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Horizontal accuracy bars. All on one blue: length carries the value, the label carries identity. */
function AccuracyBars({ rows, height }: { rows: { name: string; accuracy: number; attempted: number; correct: number }[]; height: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 28, bottom: 0, left: 0 }} barCategoryGap="28%">
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis type="category" dataKey="name" width={150} tick={axis} tickLine={false} axisLine={false} interval={0} />
        <Tooltip
          cursor={{ fill: "var(--muted)", opacity: 0.5 }}
          content={(props) => (
            <ChartTooltip
              active={props.active}
              payload={props.payload}
              describe={((d: (typeof rows)[number]) => ({
                label: d.name,
                lines: [
                  { name: "Accuracy", value: `${d.accuracy}%` },
                  { name: "Correct", value: `${d.correct} of ${d.attempted}` },
                ],
              })) as (datum: never) => Row}
            />
          )}
        />
        <Bar
          dataKey="accuracy"
          fill="var(--series-1)"
          radius={[0, 4, 4, 0]}
          maxBarSize={14}
          isAnimationActive={false}
          label={{ position: "right", fontSize: 11, fill: "var(--foreground)", formatter: (value: unknown) => `${value}%` }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SubjectAccuracyChart({ subjects }: { subjects: AnalyticsData["subjects"] }) {
  return (
    <Panel>
      <PanelTitle>Subject-wise accuracy</PanelTitle>
      <AccuracyBars rows={subjects} height={Math.max(120, subjects.length * 44)} />
      <DataTableToggle>
        <SimpleTable
          headers={["Subject", "Attempted", "Correct", "Accuracy"]}
          rows={subjects.map((s) => [s.name, s.attempted, s.correct, `${s.accuracy}%`])}
        />
      </DataTableToggle>
    </Panel>
  );
}

export function DifficultyChart({ difficulties }: { difficulties: AnalyticsData["difficulties"] }) {
  const rows = difficulties.map((d) => ({ ...d, name: d.difficulty[0] + d.difficulty.slice(1).toLowerCase() }));
  return (
    <Panel>
      <PanelTitle>Difficulty-wise performance</PanelTitle>
      <AccuracyBars rows={rows} height={150} />
      <DataTableToggle>
        <SimpleTable
          headers={["Difficulty", "Attempted", "Correct", "Accuracy"]}
          rows={rows.map((d) => [d.name, d.attempted, d.correct, `${d.accuracy}%`])}
        />
      </DataTableToggle>
    </Panel>
  );
}

/** Stacked correct and incorrect per day. Blue and orange are the first two validated categorical slots. */
export function DailyActivityChart({ daily }: { daily: AnalyticsData["daily"] }) {
  const rows = daily.map((d) => ({ ...d, incorrect: d.attempted - d.correct, label: shortDate(d.date) }));
  return (
    <Panel>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <PanelTitle hint="Questions per day, last 30 days.">Daily practice activity</PanelTitle>
        <ul className="flex gap-3 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[var(--series-1)]" aria-hidden /> Correct</li>
          <li className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[var(--series-2)]" aria-hidden /> Incorrect</li>
        </ul>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={rows} margin={{ top: 4, right: 4, bottom: 0, left: -24 }} barCategoryGap="20%">
          <CartesianGrid {...grid} />
          <XAxis dataKey="label" tick={axis} tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis allowDecimals={false} tick={axis} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.5 }}
            content={(props) => (
              <ChartTooltip
                active={props.active}
                payload={props.payload}
                describe={((d: (typeof rows)[number]) => ({
                  label: d.label,
                  lines: [
                    { name: "Correct", value: String(d.correct), color: "var(--series-1)" },
                    { name: "Incorrect", value: String(d.incorrect), color: "var(--series-2)" },
                  ],
                })) as (datum: never) => Row}
              />
            )}
          />
          <Bar dataKey="correct" stackId="a" fill="var(--series-1)" stroke="var(--card)" strokeWidth={1} maxBarSize={18} isAnimationActive={false} />
          <Bar dataKey="incorrect" stackId="a" fill="var(--series-2)" stroke="var(--card)" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={18} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
      <DataTableToggle>
        <SimpleTable
          headers={["Date", "Correct", "Incorrect"]}
          rows={rows.filter((r) => r.attempted > 0).map((r) => [r.label, r.correct, r.incorrect])}
        />
      </DataTableToggle>
    </Panel>
  );
}

function TrendChart({
  title,
  hint,
  rows,
}: {
  title: string;
  hint: string;
  rows: { label: string; accuracy: number | null; attempted: number }[];
}) {
  return (
    <Panel>
      <PanelTitle hint={hint}>{title}</PanelTitle>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
          <CartesianGrid {...grid} />
          <XAxis dataKey="label" tick={axis} tickLine={false} axisLine={false} minTickGap={20} />
          <YAxis domain={[0, 100]} ticks={[0, 50, 100]} unit="%" tick={axis} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
            content={(props) => (
              <ChartTooltip
                active={props.active}
                payload={props.payload}
                describe={((d: (typeof rows)[number]) => ({
                  label: d.label,
                  lines: [
                    { name: "Accuracy", value: d.accuracy === null ? "No practice" : `${d.accuracy}%` },
                    { name: "Questions", value: String(d.attempted) },
                  ],
                })) as (datum: never) => Row}
              />
            )}
          />
          <Line
            dataKey="accuracy"
            stroke="var(--series-1)"
            strokeWidth={2}
            connectNulls
            dot={{ r: 4, fill: "var(--series-1)", stroke: "var(--card)", strokeWidth: 2 }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <DataTableToggle>
        <SimpleTable
          headers={["Period", "Questions", "Accuracy"]}
          rows={rows.filter((r) => r.attempted > 0).map((r) => [r.label, r.attempted, `${r.accuracy}%`])}
        />
      </DataTableToggle>
    </Panel>
  );
}

export function WeeklyChart({ weekly }: { weekly: AnalyticsData["weekly"] }) {
  return (
    <TrendChart
      title="Weekly progress"
      hint="Accuracy by week, last 12 weeks."
      rows={weekly.map((w) => ({ label: shortDate(w.week), accuracy: w.accuracy, attempted: w.attempted }))}
    />
  );
}

export function MonthlyChart({ monthly }: { monthly: AnalyticsData["monthly"] }) {
  return (
    <TrendChart
      title="Monthly performance"
      hint="Accuracy by month, last 6 months."
      rows={monthly.map((m) => ({ label: monthLabel(m.month), accuracy: m.accuracy, attempted: m.attempted }))}
    />
  );
}

export function TopicAccuracy({ topics, weakIds }: { topics: TopicStat[]; weakIds: string[] }) {
  const subjects = useMemo(() => [...new Map(topics.map((t) => [t.subjectId, t.subjectName])).entries()], [topics]);
  const [subjectId, setSubjectId] = useState(subjects[0]?.[0] ?? "");
  const rows = topics
    .filter((t) => t.subjectId === subjectId)
    .sort((a, b) => a.accuracy - b.accuracy);
  const weak = new Set(weakIds);

  return (
    <Panel>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <PanelTitle hint="Lowest accuracy first.">Topic-wise accuracy</PanelTitle>
        <NativeSelect aria-label="Subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-auto">
          {subjects.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </NativeSelect>
      </div>
      <ul className="space-y-2.5">
        {rows.map((topic) => (
          <li key={topic.topicId} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 text-sm sm:grid-cols-[minmax(0,14rem)_1fr_auto]">
            <Link
              href={`/practice?subject=${topic.subjectId}&topic=${topic.topicId}`}
              className="flex items-center gap-1.5 truncate rounded outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="truncate">{topic.topicName}</span>
              {weak.has(topic.topicId) && <span className="shrink-0 rounded bg-warning-soft px-1 py-0.5 text-[10px] font-medium text-warning">Weak</span>}
            </Link>
            <span className="order-3 col-span-2 h-1.5 overflow-hidden rounded-full bg-muted sm:order-none sm:col-span-1" aria-hidden>
              <span className="block h-full rounded-full bg-[var(--series-1)]" style={{ width: `${topic.accuracy}%` }} />
            </span>
            <span className="text-right text-xs tabular-nums">
              <span className="font-medium">{topic.accuracy}%</span>
              <span className="text-muted-foreground"> · {topic.correct}/{topic.attempted}</span>
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function WeakTopicRecommendations({ weakTopics }: { weakTopics: TopicStat[] }) {
  return (
    <Panel>
      <PanelTitle hint="Below 60% accuracy with at least 3 attempts.">Practise these next</PanelTitle>
      {weakTopics.length === 0 ? (
        <p className="text-sm text-muted-foreground">No weak topics right now. Keep the practice varied.</p>
      ) : (
        <ul className="divide-y">
          {weakTopics.slice(0, 8).map((topic) => (
            <li key={topic.topicId}>
              <Link
                href={`/practice?subject=${topic.subjectId}&topic=${topic.topicId}`}
                className="flex items-center justify-between gap-3 rounded-md py-2.5 text-sm outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{topic.topicName}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {topic.subjectName} · {topic.accuracy}% over {topic.attempted} attempts
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
