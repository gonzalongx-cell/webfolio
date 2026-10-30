"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { MOCK_TENANT_MODEL } from "@/lib/mock/tenant-data";

function getDynamicGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Buenos días";
  if (hour >= 12 && hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function TopAppBar() {
  const greeting = useMemo(() => getDynamicGreeting(), []);

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
                Live
              </span>
            </div>
            <h1 className="truncate text-sm font-semibold tracking-tight text-zinc-900">
              {MOCK_TENANT_MODEL.fullName}
            </h1>
          </div>
        </div>

        {/* Avatar de la Modelo con Indicador Activo */}
        <div className="relative shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white shadow-xs ring-2 ring-white">
            {MOCK_TENANT_MODEL.avatarInitials}
          </div>
          <span
            className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
            title="Portafolio Activo"
          />
        </div>
      </div>
    </header>
  );
}
