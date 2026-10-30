"use client";

import React, { useState } from "react";
import {
  Plus,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { toggleSkillServiceAction } from "@/app/(tenant)/app/actions";
import type { SkillServiceItem } from "@/types/models";

interface ServicesListClientProps {
  initialServices: SkillServiceItem[];
}

interface ServiceToast {
  id: number;
  type: "success" | "error";
  message: string;
}

export function ServicesListClient({
  initialServices,
}: ServicesListClientProps) {
  const [services, setServices] = useState<SkillServiceItem[]>(initialServices);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ServiceToast | null>(null);

  function showToast(type: "success" | "error", message: string) {
    const id = Date.now();
    setToast({ id, type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  }

  async function handleToggle(service: SkillServiceItem) {
    if (updatingId === service.id) return;

    const previousState = service.is_active;
    const nextState = !previousState;

    // Actualización optimista inmediata en la UI
    setUpdatingId(service.id);
    setServices((prev) =>
      prev.map((item) =>
        item.id === service.id ? { ...item, is_active: nextState } : item
      )
    );

    const result = await toggleSkillServiceAction(service.id, nextState);

    if (!result.success) {
      // Revertir en caso de fallo y notificar con Toast de error
      setServices((prev) =>
        prev.map((item) =>
          item.id === service.id ? { ...item, is_active: previousState } : item
        )
      );
      showToast("error", result.message);
    } else {
      showToast("success", result.message);
    }

    setUpdatingId(null);
  }

  return (
    <div className="space-y-4">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-900">
            Servicios y Tarifas
          </h2>
          <p className="text-xs text-zinc-500">
            Configura tus especialidades y disponibilidad de reserva.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-medium text-white shadow-xs transition-transform active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Nuevo</span>
        </button>
      </div>

      {/* Lista Real de Servicios (`skills_services`) */}
      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <p className="text-xs font-medium text-zinc-600">
            No tienes servicios registrados en `skills_services`.
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">
            Ejecuta el script SQL o inicia sesión con tu cuenta de modelo.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => {
            const isUpdating = updatingId === service.id;

            return (
              <div
                key={service.id}
                className={`rounded-2xl border p-4 transition-colors ${
                  service.is_active
                    ? "border-zinc-200/80 bg-white shadow-2xs"
                    : "border-zinc-200/50 bg-zinc-100/60 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-zinc-900">
                      {service.title}
                    </h3>
                    {service.description && (
                      <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                        {service.description}
                      </p>
                    )}
                  </div>

                  {/* Switch Táctil Conectado a `skills_services.is_active` */}
                  <button
                    type="button"
                    role="switch"
                    disabled={isUpdating}
                    aria-checked={service.is_active}
                    onClick={() => handleToggle(service)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out disabled:opacity-60 ${
                      service.is_active ? "bg-zinc-900" : "bg-zinc-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        service.is_active ? "translate-x-5" : "translate-x-0"
                      }`}
                    >
                      {isUpdating && (
                        <Loader2 className="h-3 w-3 animate-spin text-zinc-600" />
                      )}
                    </span>
                  </button>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-zinc-100 pt-3">
                  <div className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-900">
                    <DollarSign className="h-3.5 w-3.5 text-zinc-500" />
                    <span>
                      {Number(service.rate_amount).toLocaleString("en-US")} USD
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-medium ${
                      service.is_active ? "text-emerald-600" : "text-zinc-400"
                    }`}
                  >
                    {service.is_active
                      ? "Visible para clientes"
                      : "Pausado temporalmente"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notificación Visual Flotante (Toast) */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-20 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-2.5 rounded-xl border p-3.5 shadow-lg ${
            toast.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-900"
              : "border-emerald-200 bg-white text-zinc-900"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          )}
          <p className="flex-1 text-xs font-medium">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
