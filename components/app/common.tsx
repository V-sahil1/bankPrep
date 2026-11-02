import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-1 text-primary">{eyebrow}</p>}
        <h1 className="text-[28px] leading-tight font-semibold text-foreground sm:text-[32px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Panel({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("rounded-2xl border bg-card p-5 shadow-soft", className)} {...props} />;
}

export function PanelTitle({ children, hint, action }: { children: ReactNode; hint?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{children}</h2>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card/60 px-6 py-14 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: LucideIcon;
  accent?: "primary" | "success" | "warning";
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <p className="eyebrow">{label}</p>
        {Icon && (
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground",
              accent === "success" && "bg-success-soft text-success",
              accent === "warning" && "bg-warning-soft text-warning",
            )}
          >
            <Icon className="size-4" aria-hidden />
          </span>
        )}
      </div>
      <p className="metric mt-3 text-3xl">{value}</p>
      {hint && <div className="mt-2 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function LinkButton({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: "default" | "outline" | "secondary" | "ghost" | "link"; size?: "default" | "sm" | "lg" | "xs" }) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  );
}

const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:opacity-50";

/** A styled native select: works everywhere, with keyboard and on phones, without extra code. */
export function NativeSelect({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(fieldClass, "pr-7", className)} {...props} />;
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string | string[];
  hint?: string;
  children: ReactNode;
}) {
  const message = Array.isArray(error) ? error[0] : error;
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && !message && <p className="text-xs text-muted-foreground">{hint}</p>}
      {message && (
        <p role="alert" className="text-xs text-danger">
          {message}
        </p>
      )}
    </div>
  );
}

/** Capsule status chip. Text wears a tint of the tone, never pure colour alone. */
export function Chip({
  tone = "neutral",
  className,
  children,
}: {
  tone?: "neutral" | "primary" | "success" | "warning" | "danger";
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold whitespace-nowrap",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "primary" && "bg-accent text-accent-foreground",
        tone === "success" && "bg-success-soft text-success",
        tone === "warning" && "bg-warning-soft text-warning",
        tone === "danger" && "bg-danger-soft text-danger",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Thin progress track. Pass a tone to colour the fill. */
export function Bar({ value, tone = "primary", className }: { value: number; tone?: "primary" | "success" | "danger" | "warning"; className?: string }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <span className={cn("block h-1.5 w-full overflow-hidden rounded-full bg-muted", className)} aria-hidden>
      <span
        className={cn(
          "block h-full rounded-full",
          tone === "primary" && "bg-primary",
          tone === "success" && "bg-success",
          tone === "danger" && "bg-danger",
          tone === "warning" && "bg-warning",
        )}
        style={{ width: `${width}%` }}
      />
    </span>
  );
}

/** SVG ring gauge, 8px track, with the value in the middle. */
export function RingGauge({
  value,
  max,
  label,
  size = 160,
  children,
}: {
  value: number;
  max: number;
  label: string;
  size?: number;
  children?: ReactNode;
}) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}
