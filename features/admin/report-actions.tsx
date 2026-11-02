"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { resolveReportAction } from "@/features/admin/actions";
import { useAction } from "@/hooks/use-action";

export function ReportActions({ reportId }: { reportId: string }) {
  const router = useRouter();
  const { pending, run } = useAction();
  const decide = (status: "RESOLVED" | "DISMISSED") =>
    run(() => resolveReportAction(reportId, status), { onSuccess: () => router.refresh() });
  return (
    <>
      <Button size="sm" variant="ghost" disabled={pending} onClick={() => decide("DISMISSED")}>Dismiss</Button>
      <Button size="sm" variant="outline" disabled={pending} onClick={() => decide("RESOLVED")}>Mark resolved</Button>
    </>
  );
}
