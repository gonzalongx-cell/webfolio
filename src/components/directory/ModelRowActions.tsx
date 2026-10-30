"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import {
  MoreHorizontal,
  ExternalLink,
  CalendarClock,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { updateProfileStatusAction } from "@/app/(admin)/actions";
import type { ProfileRecord, ProfileStatus } from "@/types/models";

interface ModelRowActionsProps {
  profile: ProfileRecord;
}

export function ModelRowActions({ profile }: ModelRowActionsProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const handleStatusChange = (newStatus: ProfileStatus) => {
    setOpen(false);
    startTransition(async () => {
      await updateProfileStatusAction(profile.id, newStatus);
    });
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        title={`Acciones para ${profile.full_name}`}
      >
        <span>{isPending ? "Guardando..." : "Acciones"}</span>
        <MoreHorizontal className="h-3.5 w-3.5 text-zinc-500" />
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1.5 w-52 origin-top-right rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
          >
            <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
            Ver portafolio privado
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
          >
            <CalendarClock className="h-3.5 w-3.5 text-zinc-400" />
            Reservas logísticas
          </button>

          <div className="my-1 border-t border-zinc-100" />
          <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Cambiar Estado
          </div>

          {profile.status !== "active" && (
            <button
              type="button"
              role="menuitem"
              onClick={() => handleStatusChange("active")}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Marcar como Activo
            </button>
          )}

          {profile.status !== "pending" && (
            <button
              type="button"
              role="menuitem"
              onClick={() => handleStatusChange("pending")}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50"
            >
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              Marcar como Pendiente
            </button>
          )}

          {profile.status !== "suspended" && (
            <button
              type="button"
              role="menuitem"
              onClick={() => handleStatusChange("suspended")}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
              Suspender cuenta
            </button>
          )}
        </div>
      )}
    </div>
  );
}
