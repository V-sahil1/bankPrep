import { BadgeCheck, FileQuestion, ShieldCheck, TriangleAlert } from "lucide-react";
import { LinkButton, PageHeader, Panel, PanelTitle, StatCard } from "@/components/app/common";
import { getBankStats } from "@/services/question-bank";

export const metadata = { title: "Admin" };

const SOURCE_LABEL = {
  ILLUSTRATIVE_SAMPLE: "Illustrative samples",
  ADMIN_AUTHORED: "Written by admins",
  AI_GENERATED: "AI-generated",
  PYQ: "Previous year questions",
};

function Breakdown({ rows }: { rows: { label: string; count: number }[] }) {
  return (
    <ul className="divide-y text-sm">
      {rows.map((row) => (
        <li key={row.label} className="flex justify-between gap-3 py-1.5">
          <span>{row.label}</span>
          <span className="font-medium tabular-nums">{row.count}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function AdminPage() {
  const stats = await getBankStats();
  return (
    <>
      <PageHeader
        title="Question bank overview"
        actions={
          <>
            <LinkButton href="/admin/questions/new">Add question</LinkButton>
            <LinkButton href="/admin/import" variant="outline">Bulk import</LinkButton>
          </>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="All questions" value={stats.total} icon={FileQuestion} />
        <StatCard label="Awaiting AI review" value={stats.byStatus.PENDING_REVIEW ?? 0} icon={ShieldCheck} />
        <StatCard label="Unverified PYQs" value={stats.unverifiedPyq} icon={BadgeCheck} />
        <StatCard label="Open reports" value={stats.openReports} icon={TriangleAlert} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel>
          <PanelTitle>By source</PanelTitle>
          <Breakdown rows={Object.entries(SOURCE_LABEL).map(([key, label]) => ({ label, count: stats.bySource[key as keyof typeof SOURCE_LABEL] ?? 0 }))} />
        </Panel>
        <Panel>
          <PanelTitle hint="Live questions only.">By difficulty</PanelTitle>
          <Breakdown
            rows={[
              { label: "Easy", count: stats.byDifficulty.EASY ?? 0 },
              { label: "Medium", count: stats.byDifficulty.MEDIUM ?? 0 },
              { label: "Hard", count: stats.byDifficulty.HARD ?? 0 },
            ]}
          />
        </Panel>
        <Panel>
          <PanelTitle hint="Live questions only.">By subject</PanelTitle>
          <Breakdown rows={stats.bySubject.map((s) => ({ label: s.name, count: s.count }))} />
        </Panel>
      </div>
    </>
  );
}
