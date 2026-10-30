"use client";

import React, { useState } from "react";
import { Plus, DollarSign } from "lucide-react";
import { MOCK_SKILLS_SERVICES } from "@/lib/mock/tenant-data";
import type { SkillServiceItem } from "@/types/models";

export default function TenantServicesPage() {
  const [services, setServices] =
    useState<SkillServiceItem[]>(MOCK_SKILLS_SERVICES);

  function toggleServiceActive(id: string) {
    setServices((prev) =>
      prev.map((srv) =>
        srv.id === id ? { ...srv, is_active: !srv.is_active } : srv
      )
    );
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

      {/* Lista de Servicios (`skills_services`) */}
      <div className="space-y-3">
        {services.map((service) => (
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
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {service.description}
                </p>
              </div>

              {/* Switch Táctil `is_active` */}
              <button
                type="button"
                role="switch"
                aria-checked={service.is_active}
                onClick={() => toggleServiceActive(service.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  service.is_active ? "bg-zinc-900" : "bg-zinc-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    service.is_active ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="mt-3.5 flex items-center justify-between border-t border-zinc-100 pt-3">
              <div className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-900">
                <DollarSign className="h-3.5 w-3.5 text-zinc-500" />
                <span>{service.rate_amount.toLocaleString("en-US")} USD</span>
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
        ))}
      </div>
    </div>
  );
}
