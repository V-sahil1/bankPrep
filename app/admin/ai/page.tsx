import { PageHeader, Panel, PanelTitle } from "@/components/app/common";
import { AIGenerator } from "@/features/admin/ai-generator";
import { getFormCatalog } from "@/features/admin/form-catalog";
import { formatDateTime } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { isAIConfigured } from "@/services/ai-generation";

export const metadata = { title: "AI Generation" };

const STATUS = { QUEUED: "Queued", RUNNING: "Running", COMPLETED: "Completed", FAILED: "Failed" };

export default async function AIPage() {
  const [catalog, jobs] = await Promise.all([
    getFormCatalog(),
    prisma.aIQuestionGenerationJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { topic: { select: { name: true } }, exam: { select: { shortName: true } } },
    }),
  ]);

  return (
    <>
      <PageHeader title="AI Generation" description="Draft new practice questions with an AI model, then approve them in review." />
      <div className="space-y-6">
        <AIGenerator catalog={catalog} configured={isAIConfigured()} />
        <Panel>
          <PanelTitle>Recent jobs</PanelTitle>
          {jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No generation jobs yet.</p>
          ) : (
            <ul className="divide-y text-sm">
              {jobs.map((job) => (
                <li key={job.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span className="min-w-0">
                    <span className="block font-medium">
                      {job.exam.shortName} · {job.topic.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {formatDateTime(job.createdAt)} · {job.requestedCount} requested{job.model ? ` · ${job.model}` : ""}
                    </span>
                    {job.error && <span className="block text-xs text-danger">{job.error}</span>}
                  </span>
                  <span className="text-right text-xs tabular-nums">
                    <span className="block font-medium">{STATUS[job.status]}</span>
                    {job.status === "COMPLETED" && (
                      <span className="block text-muted-foreground">
                        {job.generatedCount} kept · {job.duplicateCount} duplicates · {job.invalidCount} invalid
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
