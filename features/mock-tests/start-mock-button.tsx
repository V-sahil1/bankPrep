"use client";

import { useRouter } from "next/navigation";
import { Loader2, Play } from "lucide-react";
import { ConfirmButton } from "@/components/app/confirm-button";
import { startMockAction } from "@/features/mock-tests/actions";
import { useAction } from "@/hooks/use-action";

export function StartMockButton({ mockTestId, minutes, title }: { mockTestId: string; minutes: number; title: string }) {
  const router = useRouter();
  const { pending, run } = useAction();
  return (
    <ConfirmButton
      size="sm"
      destructive={false}
      disabled={pending}
      title={`Start ${title}?`}
      description={`The timer runs for up to ${minutes} minutes and keeps running if you close this tab. When time ends the test submits itself.`}
      confirmLabel="Start test"
      onConfirm={() =>
        run(() => startMockAction(mockTestId), {
          onSuccess: ({ attemptId }) => router.push(`/mock-tests/attempt/${attemptId}`),
        })
      }
    >
      {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Play aria-hidden />} Start
    </ConfirmButton>
  );
}
