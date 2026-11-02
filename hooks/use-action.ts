"use client";

import { useCallback, useTransition } from "react";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/actions";

/**
 * Runs a server action inside a transition. Failures, including dropped network
 * requests, always surface as a toast, so a button can never fail silently.
 */
export function useAction() {
  const [pending, startTransition] = useTransition();

  const run = useCallback(
    <T,>(
      action: () => Promise<ActionResult<T>>,
      handlers: { onSuccess?: (data: T) => void; onError?: (error: string, fieldErrors?: Record<string, string[]>) => void; success?: string } = {},
    ) => {
      startTransition(async () => {
        try {
          const result = await action();
          if (result.ok) {
            if (handlers.success) toast.success(handlers.success);
            handlers.onSuccess?.(result.data);
          } else {
            // A form that shows field errors inline doesn't also need a toast.
            if (!(result.fieldErrors && handlers.onError)) toast.error(result.error);
            handlers.onError?.(result.error, result.fieldErrors);
          }
        } catch {
          const message = "Could not reach the server. Check your connection and try again.";
          toast.error(message);
          handlers.onError?.(message);
        }
      });
    },
    [],
  );

  return { pending, run };
}
