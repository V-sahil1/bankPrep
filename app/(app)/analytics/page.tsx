import { BarChart3, CheckCircle2, Clock, Target, XCircle } from "lucide-react";
import { EmptyState, LinkButton, PageHeader, StatCard } from "@/components/app/common";
import {
  DailyActivityChart,
  DifficultyChart,
  MonthlyChart,
  SubjectAccuracyChart,
  TopicAccuracy,
  WeakTopicRecommendations,
  WeeklyChart,
} from "@/features/analytics/charts";
import { formatDuration } from "@/lib/dates";
import { requireUserPage } from "@/lib/session";
import { getAnalytics } from "@/services/analytics";

export const metadata = { title: "Performance Analytics" };

export default async function AnalyticsPage() {
  const user = await requireUserPage();
  const data = await getAnalytics(user.id);

  if (data.attempted === 0) {
    return (
      <>
        <PageHeader title="Performance Analytics" />
        <EmptyState
          icon={BarChart3}
          title="No data yet"
          description="Your accuracy, trends and weak topics appear here once you have answered some questions."
          action={<LinkButton href="/practice">Start practising</LinkButton>}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Performance Analytics" description="Based on every answer you have submitted in practice and mock tests." />
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard label="Attempted" value={data.attempted} icon={BarChart3} />
          <StatCard label="Correct" value={data.correct} icon={CheckCircle2} />
          <StatCard label="Incorrect" value={data.incorrect} icon={XCircle} />
          <StatCard label="Accuracy" value={`${data.accuracy}%`} icon={Target} />
          <StatCard label="Avg. time per question" value={formatDuration(data.avgTimeSec)} icon={Clock} />
        </div>
        <DailyActivityChart daily={data.daily} />
        <div className="grid gap-6 lg:grid-cols-2">
          <WeeklyChart weekly={data.weekly} />
          <MonthlyChart monthly={data.monthly} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <SubjectAccuracyChart subjects={data.subjects} />
          <DifficultyChart difficulties={data.difficulties} />
        </div>
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <TopicAccuracy topics={data.topics} weakIds={data.weakTopics.map((t) => t.topicId)} />
          <WeakTopicRecommendations weakTopics={data.weakTopics} />
        </div>
      </div>
    </>
  );
}
