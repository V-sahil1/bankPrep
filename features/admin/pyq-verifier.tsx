"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/app/common";
import { ConfirmButton } from "@/components/app/confirm-button";
import { verifyPyqAction } from "@/features/admin/actions";
import { useAction } from "@/hooks/use-action";

export function PyqVerifier({ questionId, reference, verified }: { questionId: string; reference: string; verified: boolean }) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [value, setValue] = useState(reference);

  const save = (next: boolean) =>
    run(() => verifyPyqAction({ questionId, sourceReference: value, verified: next }), {
      success: next ? "Verified. Learners can now see this question." : "Verification removed.",
      onSuccess: () => router.refresh(),
    });

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="min-w-64 flex-1">
        <Field label="Source reference" htmlFor={`ref-${questionId}`}>
          <Input id={`ref-${questionId}`} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Exam, year, shift" />
        </Field>
      </div>
      {verified ? (
        <Button variant="outline" disabled={pending} onClick={() => save(false)}>
          Remove verification
        </Button>
      ) : (
        <ConfirmButton
          destructive={false}
          disabled={pending}
          title="Verify this previous-year question?"
          description="Confirm you have checked the question against this source. Learners will see it labelled as a verified PYQ."
          confirmLabel="Verify"
          onConfirm={() => save(true)}
        >
          <BadgeCheck aria-hidden /> Verify
        </ConfirmButton>
      )}
    </div>
  );
}
