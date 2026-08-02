"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Code admin">
        <Input
          id="code"
          name="code"
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          required
          autoFocus
          placeholder="•••••••••"
          className="py-3"
        />
      </Field>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={isPending} className="py-3">
        {isPending ? "Vérification…" : "Se connecter"}
      </Button>
    </form>
  );
}
