"use client";

import React, { useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, LogOut, Loader2 } from "lucide-react";
import { signOutTenantModelAction } from "@/app/(tenant)/app/actions";

function getDynamicGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Buenos días";
  if (hour >= 12 && hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface TopAppBarProps {
  isAuthenticated: boolean;
  fullName: string;
  email: string | null;
  avatarUrl?: string | null;
}

export function TopAppBar({
  isAuthenticated,
  fullName,
  email,
  avatarUrl,
}: TopAppBarProps) {
  const router = useRouter();
  const greeting = useMemo(() => getDynamicGreeting(), []);
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await signOutTenantModelAction();
      router.replace("/login");
    });
  }

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="mx-auto flex h-16 max-w-md items-center justify-between border-b border-zinc-200/80 bg-white/85 px-4 backdrop-blur-md">
        {/* Saludo Dinámico y Contexto del Talento */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            title="Volver al Panel Súper Admin"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200/80 bg-zinc-50 text-zinc-600 transition-transform active:scale-95 hover:bg-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-zinc-500">
                {greeting},
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                <Sparkles className="h-2.5 w-2.5" />
                Activo
              </span>
            </div>
            <h1 className="truncate text-sm font-semibold tracking-tight text-zinc-900">
              {fullName}
            </h1>
          </div>
        </div>

        {/* Botón Salir + Avatar (Google OAuth o Iniciales) */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleSignOut}
              title={`Cerrar sesión (${email ?? ""})`}
              className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition-colors active:scale-95 hover:bg-zinc-100"
            >
              {isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <LogOut className="h-3 w-3" />
                  <span>Salir</span>
                </>
              )}
            </button>
          )}

          <div className="relative">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={fullName}
                className="h-9 w-9 rounded-full object-cover shadow-xs ring-2 ring-white"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white shadow-xs ring-2 ring-white">
                {getInitials(fullName || "TM")}
              </div>
            )}
            <span
              className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
              title="Portafolio Activo"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
