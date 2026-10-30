"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { inviteTalentModelAction } from "@/app/(admin)/actions";

export interface ToastNotification {
  id: number;
  type: "success" | "error";
  title: string;
  description: string;
}

interface InviteModelSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (toast: Omit<ToastNotification, "id">) => void;
}

export function InviteModelSlideOver({
  isOpen,
  onClose,
  onNotify,
}: InviteModelSlideOverProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Limpiar errores al abrir/cerrar
  useEffect(() => {
    if (!isOpen) {
      setFieldError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      setFieldError("Ingresa el nombre completo del talento.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFieldError("Ingresa una dirección de correo electrónico válida.");
      return;
    }

    setFieldError(null);
    setIsSubmitting(true);

    try {
      const result = await inviteTalentModelAction({
        fullName: trimmedName,
        email: trimmedEmail,
      });

      if (!result.success) {
        setFieldError(result.message);
        onNotify({
          type: "error",
          title: "Error al enviar invitación",
          description: result.message,
        });
        return;
      }

      onNotify({
        type: "success",
        title: "Talento invitado con éxito",
        description: result.message,
      });

      // Limpiar formulario y cerrar el Slide-over
      setFullName("");
      setEmail("");
      onClose();
    } catch {
      const fallbackMsg =
        "No fue posible comunicarse con el servidor. Intenta nuevamente.";
      setFieldError(fallbackMsg);
      onNotify({
        type: "error",
        title: "Error de red",
        description: fallbackMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop con desenfoque sutil */}
      <div
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl ring-1 ring-zinc-200 flex flex-col justify-between">
          {/* Cabecera del Slide-over */}
          <div>
            <div className="flex items-center justify-between border-b border-zinc-200/80 px-6 py-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-700">
                  <ShieldCheck className="h-3.5 w-3.5 text-zinc-600" />
                  Onboarding Manual
                </span>
                <h2
                  id="slide-over-title"
                  className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-900"
                >
                  Nuevo Portafolio de Talento
                </h2>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50"
                aria-label="Cerrar panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Formulario */}
            <form
              id="invite-model-form"
              onSubmit={handleSubmit}
              className="space-y-5 px-6 py-6"
              noValidate
            >
              <p className="text-xs leading-relaxed text-zinc-500">
                Se enviará un correo de invitación oficial mediante{" "}
                <span className="font-medium text-zinc-700">Supabase Auth</span>{" "}
                y se aprovisionará automáticamente el perfil en estado{" "}
                <span className="font-medium text-amber-700">Pendiente</span>.
              </p>

              {fieldError && (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  <span>{fieldError}</span>
                </div>
              )}

              {/* Campo: Nombre Completo */}
              <div className="space-y-1.5">
                <label
                  htmlFor="model-full-name"
                  className="block text-xs font-semibold text-zinc-700"
                >
                  Nombre Completo <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="model-full-name"
                    name="fullName"
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Sofía Montenegro"
                    className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zinc-900 focus:outline-none disabled:bg-zinc-50 disabled:text-zinc-400"
                  />
                </div>
              </div>

              {/* Campo: Correo Electrónico */}
              <div className="space-y-1.5">
                <label
                  htmlFor="model-email"
                  className="block text-xs font-semibold text-zinc-700"
                >
                  Correo Electrónico <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="model-email"
                    name="email"
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="talento@dominio.com"
                    className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zinc-900 focus:outline-none disabled:bg-zinc-50 disabled:text-zinc-400"
                  />
                </div>
              </div>

              {/* Resumen de Configuración Inicial */}
              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Parámetros de Aprovisionamiento
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Rol asignado (`role`)</span>
                  <span className="font-mono font-medium text-zinc-800">
                    model
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Estado inicial (`status`)</span>
                  <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    pending (Pendiente)
                  </span>
                </div>
              </div>
            </form>
          </div>

          {/* Pie con botones de acción y estado de carga */}
          <div className="flex items-center justify-end gap-3 border-t border-zinc-200/80 bg-zinc-50/60 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              size="md"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="invite-model-form"
              variant="primary"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enviando invitación...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Invitar y Crear Portafolio</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Contenedor flotante de notificaciones visuales (Toasts)
 */
export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastNotification[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all ${
            t.type === "success"
              ? "border-emerald-200 bg-white text-zinc-900"
              : "border-rose-200 bg-white text-zinc-900"
          }`}
        >
          {t.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-900">{t.title}</p>
            <p className="mt-0.5 text-xs text-zinc-500 break-words">
              {t.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Cerrar notificación"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
