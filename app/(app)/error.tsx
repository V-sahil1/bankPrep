"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/app/common";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <EmptyState
      icon={TriangleAlert}
      title="This page could not be loaded"
      description="Your progress is saved. Try again, and if the problem continues check that the database is running."
      action={<Button onClick={reset}>Try again</Button>}
    />
  );
}
