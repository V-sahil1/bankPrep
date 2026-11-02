"use client";

import { useRouter } from "next/navigation";
import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startListSessionAction } from "@/features/practice/actions";
import { useAction } from "@/hooks/use-action";

export function StartPyqButton({ examId, topicId, label }: { examId: string; topicId?: string; label: string }) {
  const router = useRouter();
  const { pending, run } = useAction();
  return (
    <Button
      size="sm"
      variant={topicId ? "outline" : "default"}
      disabled={pending}
      onClick={() =>
        run(() => startListSessionAction({ source: "PYQ", examId, topicId }), {
          onSuccess: ({ sessionId }) => router.push(`/practice/session/${sessionId}`),
        })
      }
    >
      {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Play aria-hidden />} {label}
    </Button>
  );
}
