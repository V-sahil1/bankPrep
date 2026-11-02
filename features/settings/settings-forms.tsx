"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, NativeSelect, Panel, PanelTitle } from "@/components/app/common";
import { ConfirmButton } from "@/components/app/confirm-button";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { changePasswordAction, resetProgressAction, updateProfileAction } from "@/features/settings/actions";
import { useAction } from "@/hooks/use-action";

export function SettingsForms({
  user,
  exams,
}: {
  user: { name: string; email: string; dailyTarget: number; preferredExamId: string | null };
  exams: { id: string; name: string }[];
}) {
  const router = useRouter();
  const profile = useAction();
  const password = useAction();
  const reset = useAction();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string[]>>({});

  function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setErrors({});
    profile.run(
      () =>
        updateProfileAction({
          name: form.get("name"),
          dailyTarget: form.get("dailyTarget"),
          preferredExamId: form.get("preferredExamId") || null,
        }),
      {
        success: "Settings saved.",
        onSuccess: () => router.refresh(),
        onError: (_error, fieldErrors) => setErrors(fieldErrors ?? {}),
      },
    );
  }

  function savePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    const form = new FormData(element);
    setPasswordErrors({});
    password.run(
      () => changePasswordAction({ currentPassword: form.get("currentPassword"), newPassword: form.get("newPassword") }),
      {
        success: "Password changed.",
        onSuccess: () => element.reset(),
        onError: (_error, fieldErrors) => setPasswordErrors(fieldErrors ?? {}),
      },
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel>
        <PanelTitle>Study preferences</PanelTitle>
        <form onSubmit={saveProfile} noValidate className="space-y-4">
          <Field label="Name" htmlFor="name" error={errors.name}>
            <Input id="name" name="name" defaultValue={user.name} required />
          </Field>
          <Field label="Email" htmlFor="email" hint="Email can't be changed.">
            <Input id="email" value={user.email} disabled readOnly />
          </Field>
          <Field label="Daily question target" htmlFor="dailyTarget" error={errors.dailyTarget}>
            <Input id="dailyTarget" name="dailyTarget" type="number" min={1} max={500} defaultValue={user.dailyTarget} required />
          </Field>
          <Field label="Preferred exam" htmlFor="preferredExamId" hint="Used for recommendations and preselected in practice.">
            <NativeSelect id="preferredExamId" name="preferredExamId" defaultValue={user.preferredExamId ?? ""}>
              <option value="">No preference</option>
              {exams.map((exam) => <option key={exam.id} value={exam.id}>{exam.name}</option>)}
            </NativeSelect>
          </Field>
          <Button type="submit" disabled={profile.pending}>
            {profile.pending && <Loader2 className="animate-spin" aria-hidden />} Save changes
          </Button>
        </form>
      </Panel>

      <div className="space-y-6">
        <Panel>
          <PanelTitle>Appearance</PanelTitle>
          <ThemeToggle />
        </Panel>

        <Panel>
          <PanelTitle>Change password</PanelTitle>
          <form onSubmit={savePassword} noValidate className="space-y-4">
            <Field label="Current password" htmlFor="currentPassword" error={passwordErrors.currentPassword}>
              <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
            </Field>
            <Field label="New password" htmlFor="newPassword" error={passwordErrors.newPassword} hint="At least 8 characters.">
              <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required />
            </Field>
            <Button type="submit" disabled={password.pending}>
              {password.pending && <Loader2 className="animate-spin" aria-hidden />} Update password
            </Button>
          </form>
        </Panel>

        <Panel>
          <PanelTitle hint="Deletes your sessions, answers, mock attempts, mistakes and streak. Bookmarks are kept.">Reset progress</PanelTitle>
          <ConfirmButton
            variant="destructive"
            title="Reset all your progress?"
            description="This permanently deletes your practice history, mock attempts, mistake notebook and streak. It can't be undone."
            confirmLabel="Reset progress"
            disabled={reset.pending}
            onConfirm={() =>
              reset.run(() => resetProgressAction(), { success: "Your progress was reset.", onSuccess: () => router.refresh() })
            }
          >
            Reset my progress
          </ConfirmButton>
        </Panel>
      </div>
    </div>
  );
}
