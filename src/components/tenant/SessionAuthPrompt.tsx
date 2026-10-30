"use client";

import React, { useState, useTransition } from "react";
import { ShieldCheck, LogIn, Loader2, AlertCircle } from "lucide-react";
import { signInTenantModelAction } from "@/app/(tenant)/app/actions";

export function SessionAuthPrompt() {
  const [email, setEmail] = useState("valentina.mendoza@webfolio.talent");
  const [password, setPassword] = useState("WebfolioTempPassword2026!");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    startTransition(async () => {
      const res = await signInTenantModelAction({ email, password });
      if (!res.success) {
        setErrorMsg(res.message);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs space-y-3">
      <div className="flex items-start gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-xs font-semibold text-zinc-900">
            Sesión del Talento Requerida (RLS)
          </h3>
          <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
            Esta app utiliza el cliente estándar de Supabase (sin{" "}
            <code className="font-mono text-zinc-700">service_role</code>).
            Inicia sesión para que PostgreSQL filtre tus registros donde{" "}
            <code className="font-mono text-zinc-700">
              auth.uid() = model_id
            </code>
            .
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSignIn} className="space-y-2.5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo del talento"
          className="h-9 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-xs text-zinc-900 focus:border-zinc-900 focus:bg-white focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 text-xs font-medium text-white shadow-xs transition-transform active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Autenticando sesión RLS...</span>
            </>
          ) : (
            <>
              <LogIn className="h-3.5 w-3.5" />
              <span>Entrar como Valentina Mendoza</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
