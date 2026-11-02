"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Field, NativeSelect } from "@/components/app/common";
import { reportQuestionAction } from "@/features/practice/actions";
import { useAction } from "@/hooks/use-action";
import { REPORT_REASONS } from "@/validations/practice";

export function ReportDialog({
  questionId,
  open,
  onOpenChange,
}: {
  questionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { pending, run } = useAction();
  const [reason, setReason] = useState("WRONG_ANSWER");
  const [details, setDetails] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    run(() => reportQuestionAction({ questionId, reason, details }), {
      success: "Thanks. An administrator will review this question.",
      onSuccess: () => {
        setDetails("");
        onOpenChange(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={submit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Report this question</DialogTitle>
            <DialogDescription>Tell us what looks wrong so it can be corrected.</DialogDescription>
          </DialogHeader>
          <Field label="What is the problem?" htmlFor="report-reason">
            <NativeSelect id="report-reason" value={reason} onChange={(e) => setReason(e.target.value)}>
              {Object.entries(REPORT_REASONS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Details (optional)" htmlFor="report-details">
            <Textarea id="report-details" value={details} maxLength={1000} onChange={(e) => setDetails(e.target.value)} rows={3} />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin" aria-hidden />} Send report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
