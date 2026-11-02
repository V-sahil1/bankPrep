"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Landmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/app/common";
import { loginAction, registerAction } from "@/features/settings/actions";
import { useAction } from "@/hooks/use-action";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const isLogin = mode === "login";

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setErrors({});
    run(() => (isLogin ? loginAction(values) : registerAction(values)), {
      onSuccess: () => {
        router.replace("/dashboard");
        router.refresh();
      },
      onError: (_message, fieldErrors) => setErrors(fieldErrors ?? {}),
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Landmark className="size-5" aria-hidden />
          </span>
          <h1 className="text-xl font-semibold">{isLogin ? "Sign in to BankPrep" : "Create your account"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Topic-wise practice for banking examinations.</p>
        </div>
        <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-xl border bg-card p-5 shadow-soft">
          {!isLogin && (
            <Field label="Name" htmlFor="name" error={errors.name}>
              <Input id="name" name="name" autoComplete="name" required aria-invalid={Boolean(errors.name)} />
            </Field>
          )}
          <Field label="Email" htmlFor="email" error={errors.email}>
            <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} />
          </Field>
          <Field
            label="Password"
            htmlFor="password"
            error={errors.password}
            hint={isLogin ? undefined : "At least 8 characters."}
          >
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              aria-invalid={Boolean(errors.password)}
            />
          </Field>
          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending && <Loader2 className="animate-spin" aria-hidden />}
            {isLogin ? "Sign in" : "Create account"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isLogin ? "New to BankPrep?" : "Already have an account?"}{" "}
          <Link href={isLogin ? "/register" : "/login"} className="font-medium text-primary hover:underline">
            {isLogin ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
