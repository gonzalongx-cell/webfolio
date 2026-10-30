"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Shield, Lock, EyeOff, Loader2, ArrowUpRight } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleGoogleLogin() {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "No fue posible conectar con Google OAuth."
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-zinc-950 text-white selection:bg-white selection:text-zinc-950">
      {/* Efecto de iluminación radial premium */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-b from-zinc-700/25 via-zinc-800/10 to-transparent blur-3xl"
      />

      {/* Cabecera Minimalista */}
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-zinc-950 shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">
            Webfolio
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
            Private Book
          </span>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <span>Consola Admin</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      {/* Sección Central Hero + Login */}
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-6 py-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-medium text-zinc-300 backdrop-blur-md">
          <Lock className="h-3.5 w-3.5 text-emerald-400" />
          <span>Acceso exclusivo por invitación o aprobación</span>
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl sm:leading-[1.15]">
          Tu portafolio profesional,{" "}
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            tu privacidad absoluta.
          </span>
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          Gestiona tu book editorial, tarifario y enlaces temporales cifrados
          para agencias internacionales desde un entorno 100% privado.
        </p>

        {/* Tarjeta de Autenticación Única con Google */}
        <div className="mt-8 w-full rounded-3xl border border-white/10 bg-zinc-900/70 p-6 shadow-2xl backdrop-blur-xl">
          {errorMessage && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-left text-xs text-rose-300">
              {errorMessage}
            </div>
          )}

          <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleLogin}
            className="group relative flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 text-sm font-semibold text-zinc-950 shadow-lg transition-all hover:bg-zinc-100 active:scale-[0.99] disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-zinc-700" />
                <span>Conectando con Google...</span>
              </>
            ) : (
              <>
                {/* Icono Oficial de Google */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.54-5.17 3.54-8.97z"
                  />
                  <path
                    fill="#34A853"
                    d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96h-4.01v3.14C3.505 21.3 7.565 24 12.255 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.535 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62h-4.01C.705 8.24.255 10.06.255 12s.45 3.76 1.27 5.38l4.01-3.14z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0 7.565 0 3.505 2.7 1.525 6.62l4.01 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Continuar con Google</span>
              </>
            )}
          </button>

          <p className="mt-4 text-[11px] leading-relaxed text-zinc-500">
            Al ingresar por primera vez, tu cuenta entrará en nuestra lista de
            verificación antes de habilitar tu portafolio.
          </p>
        </div>

        {/* Pilares de Privacidad */}
        <div className="mt-8 grid w-full grid-cols-2 gap-3 text-left">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
            <EyeOff className="h-4 w-4 text-zinc-300" />
            <p className="mt-2 text-xs font-semibold text-white">
              Cero Indexación Pública
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-400">
              Tu book solo es visible mediante tokens temporales (`client_access_links`).
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
            <Shield className="h-4 w-4 text-zinc-300" />
            <p className="mt-2 text-xs font-semibold text-white">
              Aislamiento Multi-Tenant
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-400">
              Protección criptográfica a nivel de fila (RLS) en Supabase.
            </p>
          </div>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="relative z-10 py-6 text-center text-xs text-zinc-600">
        Webfolio Private Talent Network · Todos los derechos reservados
      </footer>
    </div>
  );
}
