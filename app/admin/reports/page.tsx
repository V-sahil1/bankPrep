import { TriangleAlert } from "lucide-react";
import { EmptyState, LinkButton, PageHeader } from "@/components/app/common";
import { ReportActions } from "@/features/admin/report-actions";
import { formatDateTime } from "@/lib/dates";
import { getOpenReports } from "@/services/catalog-admin";
import { REPORT_REASONS } from "@/validations/practice";

export const metadata = { title: "Reports" };

export default async function ReportsPage() {
  const reports = await getOpenReports();
  return (
    <>
      <PageHeader title="Reports" description="Problems learners have flagged on questions." />
      {reports.length === 0 ? (
        <EmptyState icon={TriangleAlert} title="No open reports" description="Reports from the question screen appear here." />
      ) : (
        <ul className="space-y-3">
          {reports.map((report) => (
            <li key={report.id} className="rounded-xl border bg-card p-4 shadow-soft">
              <p className="text-sm font-medium">{REPORT_REASONS[report.reason as keyof typeof REPORT_REASONS] ?? report.reason}</p>
              <p className="text-xs text-muted-foreground">
                {report.user.name} · {formatDateTime(report.createdAt)} · {report.question.topic.name}
              </p>
              {report.details && <p className="mt-2 text-sm">{report.details}</p>}
              <p className="mt-2 line-clamp-2 rounded bg-muted/50 p-2 text-sm">{report.question.questionText}</p>
              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <LinkButton href={`/admin/questions/${report.question.id}`} size="sm" variant="ghost">
                  Edit question
                </LinkButton>
                <ReportActions reportId={report.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
