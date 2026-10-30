"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  ShieldAlert,
  RefreshCw,
  LogOut,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { signOutTenantModelAction } from "@/app/(tenant)/app/actions";
import type { TenantSessionContext } from "@/lib/supabase/tenant-session";
import type { ProfileStatus } from "@/types/models";

interface PendingReviewScreenProps {
  session: TenantSessionContext;
  status: ProfileStatus;
}

export function PendingReviewScreen({
  session,
  status,
}: PendingReviewScreenProps) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();
  const [isSigningOut, startSignOut] = useTransition();

  const fullName =
    session.profile?.full_name || session.email || "Talento Webfolio";
  const isSuspended = status === "suspended";

  function handleRefreshStatus() {
    startRefresh(() => {
      router.refresh();
    });
  }

  function handleSignOut() {
    startSignOut(async () => {
      await signOutTenantModelAction();
      router.replace("/login");
    });
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-white antialiased">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-between px-6 py-8">
        {/* Cabecera Superior */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-zinc-950">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Webfolio
            </span>
          </div>

          {session.email?.toLowerCase() === "gonzalezgex@gmail.com" && (
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-zinc-300 hover:bg-white/10"
            >
              <span>Consola Admin</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          )}
        </header>

        {/* Tarjeta Central de Retención / Revisión */}
        <main className="my-auto py-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/15 bg-white/5 shadow-xl">
            {isSuspended ? (
              <ShieldAlert className="h-7 w-7 text-rose-400" />
            ) : (
              <Clock className="h-7 w-7 text-amber-400" />
            )}
          </div>

          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            {isSuspended ? "Cuenta Suspendida" : "Waitlist · En Revisión"}
          </div>

          <h1 className="mt-4 text-xl font-semibold tracking-tight text-white">
            Hola, {fullName}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            {isSuspended
              ? "Tu portafolio se encuentra temporalmente suspendido. Contacta a la administración de Webfolio para más información."
              : "Tu perfil está bajo revisión. Estamos validando tus credenciales para darte acceso a Webfolio."}
          </p>

          {/* Resumen de la cuenta autenticada */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
            <div className="flex items-center gap-3">
              {session.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.avatarUrl}
                  alt={fullName}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                  {fullName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">
                  {fullName}
                </p>
                <p className="truncate font-mono text-[11px] text-zinc-400">
                  {session.email}
                </p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              disabled={isRefreshing}
              onClick={handleRefreshStatus}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 text-xs font-semibold text-zinc-950 shadow-md transition-transform active:scale-[0.99] disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>
                {isRefreshing
                  ? "Verificando estado..."
                  : "Verificar si ya fui aprobada"}
              </span>
            </button>

            <button
              type="button"
              disabled={isSigningOut}
              onClick={handleSignOut}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-transparent px-4 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </main>

        {/* Pie */}
        <footer className="text-center text-[11px] text-zinc-600">
          Privacidad garantizada · Acceso exclusivo mediante aprobación manual
        </footer>
      </div>
    </div>
  );
}
