"use client";

import React, { useMemo, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, LogIn, LogOut, Loader2 } from "lucide-react";
import {
  signInTenantModelAction,
  signOutTenantModelAction,
} from "@/app/(tenant)/app/actions";

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
}

export function TopAppBar({
  isAuthenticated,
  fullName,
  email,
}: TopAppBarProps) {
  const greeting = useMemo(() => getDynamicGreeting(), []);
  const [isPending, startTransition] = useTransition();

  function handleQuickAuth() {
    startTransition(async () => {
      if (isAuthenticated) {
        await signOutTenantModelAction();
      } else {
        await signInTenantModelAction();
      }
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
              <span
                className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.2 text-[10px] font-medium ring-1 ring-inset ${
                  isAuthenticated
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                    : "bg-amber-50 text-amber-700 ring-amber-600/20"
                }`}
              >
                <Sparkles className="h-2.5 w-2.5" />
                {isAuthenticated ? "RLS Activo" : "Sin sesión"}
              </span>
            </div>
            <h1 className="truncate text-sm font-semibold tracking-tight text-zinc-900">
              {fullName}
            </h1>
          </div>
        </div>

        {/* Botón de Sesión RLS + Avatar de la Modelo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={isPending}
            onClick={handleQuickAuth}
            title={
              isAuthenticated
                ? `Cerrar sesión (${email ?? ""})`
                : "Iniciar sesión como Valentina Mendoza para consultar con RLS"
            }
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors active:scale-95 ${
              isAuthenticated
                ? "border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                : "bg-zinc-900 text-white hover:bg-zinc-800"
            }`}
          >
            {isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : isAuthenticated ? (
              <>
                <LogOut className="h-3 w-3" />
                <span>Salir</span>
              </>
            ) : (
              <>
                <LogIn className="h-3 w-3" />
                <span>Login RLS</span>
              </>
            )}
          </button>

          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white shadow-xs ring-2 ring-white">
              {getInitials(fullName || "TM")}
            </div>
            <span
              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                isAuthenticated ? "bg-emerald-500" : "bg-amber-400"
              }`}
              title={isAuthenticated ? "Sesión Autenticada" : "Sesión no iniciada"}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
