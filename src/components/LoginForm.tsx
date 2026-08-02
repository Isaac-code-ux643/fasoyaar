"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="code" className="text-sm font-medium text-zinc-700">
          Code admin
        </label>
        <input
          id="code"
          name="code"
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          required
          autoFocus
          placeholder="•••••••••"
          className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
        />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-bf-green px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-bf-green-dark disabled:opacity-50"
      >
        {isPending ? "Vérification…" : "Se connecter"}
      </button>
    </form>
  );
}
