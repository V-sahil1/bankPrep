import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileQuestion,
  Flame,
  History,
  NotebookPen,
  Play,
  Target,
  TrendingDown,
  Trophy,
} from "lucide-react";
import { Bar, Chip, EmptyState, LinkButton, Panel, PanelTitle, RingGauge, StatCard } from "@/components/app/common";
import { formatDate, formatDateTime, formatDuration } from "@/lib/dates";
import { requireUserPage } from "@/lib/session";
import { getDashboard, percent } from "@/services/analytics";

export const metadata = { title: "Dashboard" };

const greeting = () => {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: process.env.APP_TIMEZONE ?? "Asia/Kolkata", hour: "numeric", hour12: false }).format(new Date()),
  );
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
};

export default async function DashboardPage() {
  const user = await requireUserPage();
  const data = await getDashboard(user.id, user.preferredExamId, user.dailyTarget);
  const remaining = Math.max(0, data.dailyTarget - data.todayAttempted);
  const targetExam = data.exams.find((exam) => exam.id === user.preferredExamId) ?? null;
  const recommendedExam = data.exams.find((exam) => exam.id === data.recommendedExamId);
  const resume = data.activeSessions[0];
  const topicLink = (subjectId: string, topicId: string) =>
    `/practice?subject=${subjectId}&topic=${topicId}${recommendedExam ? `&exam=${recommendedExam.slug}` : ""}`;

  const workspaces = [
    { href: "/practice", icon: BookOpen, title: "Topic-wise practice", text: "Drill one topic at a time at your level.", foot: `${data.workspace.topicsWithQuestions} topics with questions` },
    { href: "/mock-tests", icon: ClipboardList, title: "Mock tests", text: "Timed sections with negative marking.", foot: `${data.workspace.mockCount} tests available` },
    { href: "/mistakes", icon: NotebookPen, title: "Mistake notebook", text: "Retry what you got wrong until it sticks.", foot: data.workspace.dueMistakes > 0 ? `${data.workspace.dueMistakes} due for revision` : "Nothing due", tone: data.workspace.dueMistakes > 0 ? "danger" : "neutral" },
    { href: "/pyq", icon: FileQuestion, title: "PYQ archive", text: "Verified previous-year questions only.", foot: data.workspace.verifiedPyq > 0 ? `${data.workspace.verifiedPyq} verified questions` : "None verified yet" },
  ] as const;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-soft sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-accent/70 blur-3xl" aria-hidden />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Chip tone="primary">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                {targetExam ? `Target: ${targetExam.name}` : "No target exam yet"}
              </Chip>
              <Chip>
                <CalendarDays className="size-3" aria-hidden /> {formatDate(new Date())}
              </Chip>
            </div>
            <h1 className="text-4xl leading-none font-semibold sm:text-5xl">
              {greeting()}, {user.name.split(" ")[0]}
            </h1>
            <p className="script-accent mt-3 text-lg">
              {remaining > 0 ? `${remaining} questions to go for today's target.` : "Today's target is done. Keep the streak going."}
            </p>

            <div className="mt-6 rounded-2xl bg-surface-2 p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-semibold">
                  <Trophy className="size-4 text-primary" aria-hidden /> Overall accuracy
                </span>
                <span className="metric text-base text-primary">{data.attempted ? `${data.accuracy}%` : "–"}</span>
              </div>
              <Bar value={data.accuracy} className="mt-2.5 h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {data.attempted ? `${data.attempted} questions answered across practice and mocks.` : "Answer a few questions to see your accuracy."}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {resume && (
                <LinkButton href={`/practice/session/${resume.id}`} size="lg" className="h-11 rounded-xl px-5">
                  <Play aria-hidden /> Resume: {resume.topic?.name ?? "practice session"}
                </LinkButton>
              )}
              <LinkButton href="/practice" size="lg" variant={resume ? "secondary" : "default"} className="h-11 rounded-xl px-5">
                <Target aria-hidden /> Start Topic-Wise Practice
              </LinkButton>
              <LinkButton href="/mock-tests" size="lg" variant="secondary" className="h-11 rounded-xl px-5">
                <ClipboardList aria-hidden /> Take a mock test
              </LinkButton>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-soft lg:self-start">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Daily target</p>
              <Target className="size-4 text-primary" aria-hidden />
            </div>
            <p className="metric mt-3 text-5xl">
              {data.todayAttempted}
              <span className="ml-1 font-sans text-base font-normal text-muted-foreground"> / {data.dailyTarget} solved</span>
            </p>
            <Bar value={percent(data.todayAttempted, data.dailyTarget)} className="mt-4 h-2" />
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Time spent: {formatDuration(data.todayTimeSec)}</span>
              <span className="font-semibold text-primary">{remaining} remaining</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Questions attempted"
          value={data.attempted}
          icon={History}
          hint={<Chip tone="primary">+{data.todayAttempted} today</Chip>}
        />
        <StatCard
          label="Overall accuracy"
          value={data.attempted ? `${data.accuracy}%` : "–"}
          icon={Target}
          hint={data.todayAttempted ? `${percent(data.todayCorrect, data.todayAttempted)}% today` : "No answers yet today"}
        />
        <StatCard
          label="Mocks completed"
          value={data.mocksCompleted}
          icon={ClipboardList}
          hint={data.bestMockScore !== null ? `Best score ${data.bestMockScore}` : "No mock test yet"}
        />
        <StatCard
          label="Study streak"
          value={`${data.streak} ${data.streak === 1 ? "day" : "days"}`}
          icon={Flame}
          accent="warning"
          hint={data.streak > 0 ? "Keep it going" : "Practise today to start one"}
        />
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Study workspaces</h2>
          <span className="eyebrow">Quick launch</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workspaces.map(({ href, icon: Icon, title, text, foot, ...rest }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border bg-card p-5 shadow-soft transition-shadow outline-none hover:shadow-lift focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" aria-hidden />
                </span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              <p className={"tone" in rest && rest.tone === "danger" ? "mt-3 text-xs font-semibold text-danger" : "mt-3 text-xs font-semibold text-primary"}>{foot}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <section className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-xl font-semibold">My examinations</h2>
            <Chip tone="primary">{data.exams.length} available</Chip>
          </div>
          <ul className="space-y-3">
            {data.exams.map((exam) => (
              <li key={exam.id} className={`rounded-2xl border bg-card p-4 shadow-soft ${exam.id === user.preferredExamId ? "border-primary/40" : ""}`}>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent px-1 text-center font-heading text-sm leading-tight font-semibold text-accent-foreground">
                    {exam.shortName}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{exam.name}</h3>
                      {exam.id === user.preferredExamId && <Chip tone="primary">Target</Chip>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {exam.available} questions in the bank · {exam.attempted ? `${exam.attempted} answered by you` : "not started"}
                    </p>
                  </div>
                  <div className="w-full sm:w-44">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-semibold tabular-nums">{exam.attempted ? `${exam.accuracy}%` : "–"}</span>
                    </div>
                    <Bar value={exam.attempted ? exam.accuracy : 0} className="mt-1.5" />
                    <Link href={`/practice?exam=${exam.slug}`} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                      Open syllabus <ArrowRight className="size-3" aria-hidden />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <Panel className="min-w-0">
          <PanelTitle hint="Below 60% accuracy with at least 3 attempts." action={data.weakTopics.length > 0 ? <Chip tone="danger">Needs work</Chip> : undefined}>
            Weak topics
          </PanelTitle>
          {data.weakTopics.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="size-4" aria-hidden />
              {data.attempted === 0 ? "Answer a few questions and weak topics will show up here." : "No weak topics right now."}
            </p>
          ) : (
            <ul className="space-y-4">
              {data.weakTopics.map((topic) => (
                <li key={topic.topicId}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">{topic.topicName}</span>
                    <Chip tone="danger">{topic.accuracy}% acc.</Chip>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {topic.subjectName} · {topic.correct} of {topic.attempted} correct
                  </p>
                  <Bar value={topic.accuracy} tone="danger" className="mt-2" />
                  <Link href={topicLink(topic.subjectId, topic.topicId)} className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    Practise this topic <ArrowRight className="size-3" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {data.recommendedTopics.length > 0 && (
            <div className="mt-5 border-t pt-4">
              <p className="eyebrow mb-2">Not yet attempted{recommendedExam ? ` · ${recommendedExam.shortName}` : ""}</p>
              <ul className="space-y-1.5">
                {data.recommendedTopics.map((topic) => (
                  <li key={topic.id}>
                    <Link href={topicLink(topic.subject.id, topic.id)} className="flex items-center justify-between gap-2 text-sm hover:text-primary">
                      <span className="truncate">
                        {topic.name} <span className="text-xs text-muted-foreground">· {topic.subject.name}</span>
                      </span>
                      <ArrowRight className="size-3.5 shrink-0" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <Panel className="flex min-w-0 flex-col">
          <PanelTitle>Daily study goal</PanelTitle>
          <div className="flex flex-1 flex-col items-center justify-center gap-5">
            <RingGauge value={data.todayAttempted} max={data.dailyTarget} label={`${data.todayAttempted} of ${data.dailyTarget} solved today`}>
              <span className="metric text-4xl">{data.todayAttempted}</span>
              <span className="text-xs text-muted-foreground">/ {data.dailyTarget} solved</span>
            </RingGauge>
            <div className="grid w-full grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-2 p-3">
                <p className="eyebrow">Time today</p>
                <p className="metric mt-1 text-xl">{formatDuration(data.todayTimeSec)}</p>
              </div>
              <div className="rounded-xl bg-surface-2 p-3">
                <p className="eyebrow">Pace per question</p>
                <p className="metric mt-1 text-xl">{data.todayAttempted ? formatDuration(data.todayTimeSec / data.todayAttempted) : "–"}</p>
              </div>
            </div>
          </div>
          <LinkButton href="/practice" className="mt-5 h-11 w-full rounded-xl">
            {remaining > 0 ? `Complete remaining ${remaining}` : "Practise more"}
          </LinkButton>
        </Panel>

        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent activity</h2>
            <Link href="/history" className="text-xs font-semibold text-primary hover:underline">
              View all history
            </Link>
          </div>
          {data.activity.length === 0 ? (
            <EmptyState
              icon={History}
              title="No sessions yet"
              description="Finished sessions and mock tests will appear here with your score."
              action={<LinkButton href="/practice">Start practising</LinkButton>}
            />
          ) : (
            <Panel className="p-0">
              <ul className="divide-y">
                {data.activity.map((entry) => (
                  <li key={`${entry.kind}-${entry.id}`}>
                    <Link
                      href={entry.kind === "mock" ? `/mock-tests/attempt/${entry.id}/results` : `/practice/session/${entry.id}/results`}
                      className="flex items-center gap-4 px-5 py-3.5 outline-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                        {entry.kind === "mock" ? <ClipboardList className="size-4" aria-hidden /> : <BookOpen className="size-4" aria-hidden />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-semibold">{entry.title}</span>
                          <Chip tone="primary">{entry.mode === "MOCK" ? "Mock test" : entry.mode === "TEST" ? "Test mode" : "Practice"}</Chip>
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          Score <span className="font-semibold text-foreground">{entry.score}</span>
                          {entry.attempted > 0 && (
                            <>
                              {" · "}Accuracy <span className="font-semibold text-primary">{entry.accuracy}%</span>
                            </>
                          )}
                          {entry.meta && ` · ${entry.meta}`}
                        </span>
                      </span>
                      <span className="shrink-0 text-right text-xs text-muted-foreground">{formatDateTime(entry.at)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </section>
      </div>
    </div>
  );
}
