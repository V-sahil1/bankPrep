import { SearchX } from "lucide-react";
import { EmptyState, LinkButton } from "@/components/app/common";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl p-8">
      <EmptyState
        icon={SearchX}
        title="Page not found"
        description="This page does not exist, or it belongs to another account."
        action={<LinkButton href="/dashboard">Go to dashboard</LinkButton>}
      />
    </div>
  );
}
