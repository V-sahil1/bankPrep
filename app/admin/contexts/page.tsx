import { PageHeader } from "@/components/app/common";
import { ContextManager } from "@/features/admin/context-manager";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Passages & Data Sets" };

type StoredTable = { columns: string[]; rows: (string | number)[][] } | null;

export default async function ContextsPage() {
  const contexts = await prisma.questionContext.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { questions: true } } },
  });
  return (
    <>
      <PageHeader title="Passages & Data Sets" description="Shared material that several questions can link to. Pick one on the question form." />
      <ContextManager
        contexts={contexts.map((c) => {
          const table = c.table as StoredTable;
          return {
            id: c.id,
            type: c.type,
            title: c.title,
            content: c.content,
            tableText: table ? [table.columns, ...table.rows].map((row) => row.join(", ")).join("\n") : "",
            questionCount: c._count.questions,
          };
        })}
      />
    </>
  );
}
