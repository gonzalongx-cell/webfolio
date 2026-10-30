"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  toggleSkillServiceAction,
  createSkillServiceAction,
  deleteSkillServiceAction,
} from "@/app/(tenant)/app/actions";
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
  const router = useRouter();
  const [services, setServices] = useState<SkillServiceItem[]>(initialServices);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rateAmount, setRateAmount] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<ServiceToast | null>(null);

  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  function showToast(type: "success" | "error", message: string) {
    const id = Date.now();
    setToast({ id, type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4500);
  }

  async function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isCreating) return;

    setIsCreating(true);
    const res = await createSkillServiceAction({
      title,
      description,
      rateAmount: Number(rateAmount),
    });
    setIsCreating(false);

    if (!res.success) {
      showToast("error", res.message);
      return;
    }

    showToast("success", res.message);
    setTitle("");
    setDescription("");
    setRateAmount("");
    setIsModalOpen(false);
    router.refresh();
  }

  async function handleToggle(service: SkillServiceItem) {
    if (updatingId === service.id) return;

    const previousState = service.is_active;
    const nextState = !previousState;

    setUpdatingId(service.id);
    setServices((prev) =>
      prev.map((item) =>
        item.id === service.id ? { ...item, is_active: nextState } : item
      )
    );

    const result = await toggleSkillServiceAction(service.id, nextState);

    if (!result.success) {
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

  async function handleDelete(serviceId: string) {
    setUpdatingId(serviceId);
    const res = await deleteSkillServiceAction(serviceId);
    setUpdatingId(null);
    if (!res.success) {
      showToast("error", res.message);
    } else {
      showToast("success", res.message);
      router.refresh();
    }
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
          onClick={() => setIsModalOpen(true)}
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
            No tienes servicios registrados todavía.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-medium text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Agregar primer servicio</span>
          </button>
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

                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[11px] font-medium ${
                        service.is_active ? "text-emerald-600" : "text-zinc-400"
                      }`}
                    >
                      {service.is_active
                        ? "Visible para clientes"
                        : "Pausado"}
                    </span>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleDelete(service.id)}
                      className="rounded p-1 text-zinc-400 hover:bg-rose-50 hover:text-rose-600"
                      title="Eliminar servicio"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Móvil para Crear Nuevo Servicio */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/50 p-4 backdrop-blur-xs sm:items-center">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-zinc-200">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-semibold text-zinc-900">
                Nuevo Servicio / Tarifa
              </h3>
              <button
                type="button"
                disabled={isCreating}
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Título del Servicio *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Sesión Editorial Full Day"
                  className="mt-1 h-10 w-full rounded-xl border border-zinc-200 px-3 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles de jornada, locación o entregables..."
                  className="mt-1 w-full rounded-xl border border-zinc-200 p-3 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Tarifa en USD *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={rateAmount}
                  onChange={(e) => setRateAmount(e.target.value)}
                  placeholder="Ej. 650"
                  className="mt-1 h-10 w-full rounded-xl border border-zinc-200 px-3 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isCreating}
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 flex-1 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-zinc-900 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Servicio</span>
                  )}
                </button>
              </div>
            </form>
          </div>
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
