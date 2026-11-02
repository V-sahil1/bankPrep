"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Loader2, Play, Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Bar, Chip } from "@/components/app/common";
import { startTopicSessionAction } from "@/features/practice/actions";
import { useAction } from "@/hooks/use-action";
import { cn } from "@/lib/utils";
import { emptyAvailability, type PracticeCatalog, type TopicAvailability } from "@/services/practice";
import { MAX_SESSION_QUESTIONS } from "@/validations/practice";

type Availability = Record<string, TopicAvailability>;
type TopicStat = { attempted: number; correct: number; accuracy: number };
type DifficultyChoice = "EASY" | "MEDIUM" | "HARD" | "MIXED";
type ModeChoice = "PRACTICE" | "TEST";

const COMMON = "common";
const COUNTS = [10, 20, 30, 50];
const DIFFICULTIES: { value: DifficultyChoice; label: string }[] = [
  { value: "MIXED", label: "Mixed" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

const total = (a?: Availability[string]) => (a ? Object.values(a).reduce((sum, n) => sum + n, 0) : 0);

function statusOf(stat?: TopicStat): { label: string; tone: "danger" | "success" | "primary" | "neutral" } {
  if (!stat || stat.attempted === 0) return { label: "Unattempted", tone: "neutral" };
  if (stat.attempted >= 3 && stat.accuracy < 60) return { label: "Needs revision", tone: "danger" };
  if (stat.accuracy >= 80) return { label: "Strong", tone: "success" };
  return { label: "In progress", tone: "primary" };
}

export type HubResume = { sessionId: string; topicName: string; examName: string | null; answered: number; total: number } | null;

export function PracticeHub({
  catalog,
  availabilityByExam,
  commonAvailability,
  topicStats,
  solved,
  resume,
  initial,
  preferredExamId,
}: {
  catalog: PracticeCatalog;
  availabilityByExam: Record<string, Availability>;
  commonAvailability: Availability;
  topicStats: Record<string, TopicStat>;
  solved: Record<string, number>;
  resume: HubResume;
  initial: { examSlug?: string; subjectId?: string; topicId?: string; q?: string };
  preferredExamId: string | null;
}) {
  const initialExam =
    catalog.exams.find((e) => e.slug === initial.examSlug) ??
    (initial.topicId ? catalog.exams.find((e) => e.id === preferredExamId && e.topicIds.includes(initial.topicId!)) ?? catalog.exams.find((e) => e.topicIds.includes(initial.topicId!)) : undefined) ??
    catalog.exams.find((e) => e.id === preferredExamId) ??
    catalog.exams[0];

  const [examKey, setExamKey] = useState<string>(initial.examSlug === "all" ? COMMON : (initialExam?.id ?? COMMON));
  const [query, setQuery] = useState(initial.q ?? "");
  const exam = catalog.exams.find((e) => e.id === examKey) ?? null;
  const availability = useMemo(
    () => (exam ? (availabilityByExam[exam.id] ?? {}) : commonAvailability),
    [availabilityByExam, commonAvailability, exam],
  );

  const subjects = useMemo(
    () =>
      catalog.subjects
        .filter((s) => !exam || exam.subjectIds.includes(s.id))
        .map((s) => {
          const topics = s.topics.filter((t) => !exam || exam.topicIds.includes(t.id));
          const attempted = topics.reduce((sum, t) => sum + (topicStats[t.id]?.attempted ?? 0), 0);
          const correct = topics.reduce((sum, t) => sum + (topicStats[t.id]?.correct ?? 0), 0);
          return {
            ...s,
            topics,
            questions: topics.reduce((sum, t) => sum + total(availability[t.id]), 0),
            attempted,
            accuracy: attempted ? Math.round((correct / attempted) * 100) : null,
          };
        }),
    [availability, catalog.subjects, exam, topicStats],
  );

  const [subjectId, setSubjectId] = useState<string>(() => {
    const wanted = initial.subjectId && subjects.find((s) => s.id === initial.subjectId);
    return wanted ? wanted.id : (subjects[0]?.id ?? "");
  });
  const subject = subjects.find((s) => s.id === subjectId) ?? subjects[0] ?? null;

  const [setupTopicId, setSetupTopicId] = useState<string | null>(() =>
    initial.topicId && subjects.some((s) => s.topics.some((t) => t.id === initial.topicId)) ? initial.topicId : null,
  );

  const searching = query.trim().length > 0;
  const shownTopics = searching
    ? subjects.flatMap((s) => s.topics.filter((t) => t.name.toLowerCase().includes(query.trim().toLowerCase())).map((t) => ({ ...t, subjectName: s.name })))
    : (subject?.topics.map((t) => ({ ...t, subjectName: subject.name })) ?? []);

  const setupTopic = subjects.flatMap((s) => s.topics.map((t) => ({ ...t, subjectId: s.id, subjectName: s.name }))).find((t) => t.id === setupTopicId) ?? null;

  function chooseExam(key: string) {
    setExamKey(key);
    const next = catalog.subjects.filter((s) => key === COMMON || catalog.exams.find((e) => e.id === key)?.subjectIds.includes(s.id));
    if (!next.some((s) => s.id === subjectId)) setSubjectId(next[0]?.id ?? "");
  }

  return (
    <div className="space-y-8">
      <header className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="eyebrow text-primary">Curated modular syllabus</p>
          <h1 className="mt-1 text-4xl leading-none font-semibold">Choose what you want to master</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Target your weak zones through topic drills at the level you choose. Every topic is filtered to the exam you pick.
          </p>
        </div>
        {resume && (
          <a
            href={`/practice/session/${resume.sessionId}`}
            className="flex items-center gap-3 rounded-2xl border bg-card p-3 pr-4 shadow-soft outline-none hover:shadow-lift focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Play className="size-4" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="eyebrow">Quick resume</span>
                <Chip tone="danger">{resume.total - resume.answered} pending</Chip>
              </span>
              <span className="block truncate text-sm font-semibold">{resume.topicName}</span>
              <span className="block text-xs text-muted-foreground">{resume.examName ?? "Common practice"}</span>
            </span>
            <ArrowRight className="size-4 text-primary" aria-hidden />
          </a>
        )}
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-2 shadow-soft md:flex-row md:items-center">
        <div role="group" aria-label="Examination" className="flex flex-wrap gap-1.5">
          <button
            type="button"
            aria-pressed={examKey === COMMON}
            onClick={() => chooseExam(COMMON)}
            className={cn(
              "h-9 rounded-full px-3.5 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              examKey === COMMON ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
            )}
          >
            All exams
          </button>
          {catalog.exams.map((e) => (
            <button
              key={e.id}
              type="button"
              aria-pressed={examKey === e.id}
              onClick={() => chooseExam(e.id)}
              className={cn(
                "h-9 rounded-full px-3.5 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                examKey === e.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {e.shortName}
            </button>
          ))}
        </div>
        <label className="relative ml-auto flex w-full items-center md:w-72">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" aria-hidden />
          <span className="sr-only">Search topics</span>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search any topic, e.g. Syllogism" className="h-9 rounded-full pl-9" />
        </label>
      </div>

      {!searching && (
        <section aria-labelledby="subjects-heading">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 id="subjects-heading" className="text-xl font-semibold">
                Subject modules
              </h2>
              <p className="text-xs text-muted-foreground">
                {exam ? exam.name : "Common practice across every exam"} · select a subject to see its topics
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {subjects.map((s) => {
              const strongest = s.topics
                .filter((t) => topicStats[t.id]?.attempted)
                .sort((a, b) => (topicStats[b.id]?.accuracy ?? 0) - (topicStats[a.id]?.accuracy ?? 0))
                .slice(0, 3);
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={s.id === subject?.id}
                  aria-label={`${s.name}: ${s.topics.length} topics, ${s.questions} questions, your accuracy ${s.accuracy === null ? "not available" : `${s.accuracy}%`}`}
                  onClick={() => setSubjectId(s.id)}
                  className={cn(
                    "flex flex-col rounded-2xl border bg-card p-4 text-left shadow-soft transition-shadow outline-none hover:shadow-lift focus-visible:ring-3 focus-visible:ring-ring/40",
                    s.id === subject?.id && "border-primary ring-1 ring-primary",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-accent font-heading text-sm font-semibold text-accent-foreground">
                      {s.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </span>
                    {s.id === subject?.id ? <Chip tone="primary">Active</Chip> : <Chip>{s.topics.length} topics</Chip>}
                  </div>
                  <span className="mt-3 text-lg leading-tight font-semibold">{s.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {s.topics.length} topics · {s.questions} questions
                  </span>
                  <span className="mt-3 flex items-center justify-between rounded-lg bg-surface-2 px-2.5 py-1.5 text-xs">
                    <span className="text-muted-foreground">Your accuracy</span>
                    <span className="metric text-base">{s.accuracy === null ? "–" : `${s.accuracy}%`}</span>
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1">
                    {strongest.length === 0 ? (
                      <Chip>Not started</Chip>
                    ) : (
                      strongest.map((t) => (
                        <Chip key={t.id} tone={statusOf(topicStats[t.id]).tone}>
                          {t.name} {topicStats[t.id].accuracy}%
                        </Chip>
                      ))
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section aria-labelledby="topics-heading">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <SlidersHorizontal className="size-4" aria-hidden />
            </span>
            <div>
              <h2 id="topics-heading" className="text-xl font-semibold">
                {searching ? `Topics matching "${query.trim()}"` : `${subject?.name ?? "Topics"}: topic drill-down`}
              </h2>
              <p className="text-xs text-muted-foreground">
                {exam ? `Questions tagged for ${exam.name}` : "Questions from the whole bank"} · {shownTopics.length} topics
              </p>
            </div>
          </div>
          <Chip tone="primary">{shownTopics.filter((t) => total(availability[t.id]) > 0).length} ready to practise</Chip>
        </div>

        {shownTopics.length === 0 && <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">No topics match.</p>}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shownTopics.map((t) => {
            const counts = availability[t.id] ?? emptyAvailability();
            const n = total(counts);
            const stat = topicStats[t.id];
            const status = statusOf(stat);
            const done = solved[t.id] ?? 0;
            return (
              <article key={t.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-soft">
                <div className="flex flex-wrap gap-1.5">
                  <Chip tone="primary">{t.subjectName}</Chip>
                  <Chip tone={status.tone}>{status.label}</Chip>
                </div>
                <h3 className="mt-3 text-xl leading-tight font-semibold">{t.name}</h3>
                <div className="mt-4 rounded-xl bg-surface-2 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span>
                      <span className="font-semibold tabular-nums">{Math.min(done, n)}</span>
                      <span className="text-muted-foreground"> / {n} solved</span>
                    </span>
                    <span className={cn("font-semibold tabular-nums", status.tone === "danger" ? "text-danger" : "text-primary")}>
                      {stat?.attempted ? `${stat.accuracy}% accuracy` : "No attempts"}
                    </span>
                  </div>
                  <Bar value={n ? (Math.min(done, n) / n) * 100 : 0} tone={status.tone === "danger" ? "danger" : "primary"} className="mt-2" />
                </div>
                <p className="eyebrow mt-4">Difficulty matrix</p>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {(["EASY", "MEDIUM", "HARD"] as const).map((level) => (
                    <div key={level} className="rounded-lg border px-2 py-1.5 text-center">
                      <p className="text-[11px] text-muted-foreground">{level[0] + level.slice(1).toLowerCase()}</p>
                      <p className={cn("metric text-base", level === "HARD" && counts.HARD > 0 && "text-danger")}>{counts[level]} Qs</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <Button className="h-10 flex-1 rounded-xl" disabled={n === 0} onClick={() => setSetupTopicId(t.id)}>
                    <Play aria-hidden /> {n === 0 ? "No questions yet" : "Start practice"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <SetupDialog
        key={setupTopic?.id ?? "none"}
        topic={setupTopic}
        counts={setupTopic ? (availability[setupTopic.id] ?? emptyAvailability()) : null}
        examId={exam?.id ?? null}
        examName={exam?.name ?? "Common practice"}
        onClose={() => setSetupTopicId(null)}
      />
    </div>
  );
}

function SetupDialog({
  topic,
  counts,
  examId,
  examName,
  onClose,
}: {
  topic: { id: string; name: string; subjectId: string; subjectName: string } | null;
  counts: Availability[string] | null;
  examId: string | null;
  examName: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [difficulty, setDifficulty] = useState<DifficultyChoice>("MIXED");
  const [count, setCount] = useState(10);
  const [customCount, setCustomCount] = useState("");
  const [mode, setMode] = useState<ModeChoice>("PRACTICE");

  const available = !counts ? 0 : difficulty === "MIXED" ? total(counts) : counts[difficulty];
  const requested = customCount ? Number(customCount) : count;
  const customInvalid = customCount !== "" && (!Number.isInteger(requested) || requested < 1 || requested > MAX_SESSION_QUESTIONS);

  function start() {
    if (!topic) return;
    if (customInvalid) {
      toast.error(`Enter a number between 1 and ${MAX_SESSION_QUESTIONS}.`);
      return;
    }
    run(
      () =>
        startTopicSessionAction({
          common: examId === null,
          examId,
          subjectId: topic.subjectId,
          topicId: topic.id,
          difficulty,
          count: requested,
          mode,
        }),
      {
        onSuccess: ({ sessionId, served, requested: asked }) => {
          if (served < asked) toast.info(`Only ${served} of ${asked} questions are available for this selection.`);
          router.push(`/practice/session/${sessionId}`);
        },
      },
    );
  }

  return (
    <Dialog open={topic !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        {topic && counts && (
          <>
            <DialogHeader>
              <p className="eyebrow text-primary">
                {examName} · {topic.subjectName}
              </p>
              <DialogTitle className="text-2xl">{topic.name}</DialogTitle>
              <DialogDescription>Set the difficulty, length and mode for this session.</DialogDescription>
            </DialogHeader>

            <fieldset>
              <legend className="mb-2 text-sm font-medium">Difficulty</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DIFFICULTIES.map(({ value, label }) => {
                  const n = value === "MIXED" ? total(counts) : counts[value];
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={difficulty === value}
                      disabled={n === 0}
                      onClick={() => setDifficulty(value)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm outline-none hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
                        difficulty === value && "border-primary bg-accent/50",
                      )}
                    >
                      <span className="font-medium">{label}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{n}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm font-medium">Number of questions</legend>
              <div className="flex flex-wrap items-center gap-2">
                {COUNTS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={!customCount && count === n}
                    onClick={() => {
                      setCount(n);
                      setCustomCount("");
                    }}
                    className={cn(
                      "h-10 min-w-12 rounded-xl border px-3 text-sm font-medium tabular-nums outline-none hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/40",
                      !customCount && count === n && "border-primary bg-accent/50",
                    )}
                  >
                    {n}
                  </button>
                ))}
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Custom</span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={MAX_SESSION_QUESTIONS}
                    value={customCount}
                    onChange={(e) => setCustomCount(e.target.value)}
                    aria-invalid={customInvalid}
                    className="h-10 w-20"
                  />
                </label>
              </div>
              <p className={cn("mt-2 text-xs", customInvalid ? "text-danger" : "text-muted-foreground")}>
                {customInvalid
                  ? `Enter a whole number between 1 and ${MAX_SESSION_QUESTIONS}.`
                  : requested > available
                    ? `Only ${available} available at this difficulty, so the session will have ${available}.`
                    : `${available} available at this difficulty. Questions you have not seen come first.`}
              </p>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm font-medium">Mode</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {(
                  [
                    ["PRACTICE", "Practice mode", "See the answer and explanation right after each submission."],
                    ["TEST", "Test mode", "Answers stay hidden until you finish. You can change them until then."],
                  ] as const
                ).map(([value, label, text]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={mode === value}
                    onClick={() => setMode(value)}
                    className={cn(
                      "rounded-xl border p-3 text-left outline-none hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/40",
                      mode === value && "border-primary bg-accent/50",
                    )}
                  >
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{text}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button className="h-10 rounded-xl px-5" onClick={start} disabled={pending || available === 0 || customInvalid}>
                {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Play aria-hidden />} Start session
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
