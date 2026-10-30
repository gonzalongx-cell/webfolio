"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  ExternalLink,
  CalendarClock,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { TalentModel } from "@/types/models";

interface ModelRowActionsProps {
  model: TalentModel;
}

export function ModelRowActions({ model }: ModelRowActionsProps) {
  const [open, setOpen] = useState(false);
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

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        title={`Acciones para ${model.fullName}`}
      >
        <span>Acciones</span>
        <MoreHorizontal className="h-3.5 w-3.5 text-zinc-500" />
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1.5 w-48 origin-top-right rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5"
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
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
            Cambiar estado
          </button>
        </div>
      )}
    </div>
  );
}
