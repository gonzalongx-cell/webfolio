"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Copy,
  Check,
  KeyRound,
  CalendarClock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import {
  createClientAccessLinkAction,
  deleteClientAccessLinkAction,
} from "@/app/(tenant)/app/actions";
import type { ClientAccessLinkItem } from "@/types/models";

interface AccessLinksListClientProps {
  links: ClientAccessLinkItem[];
}

export function AccessLinksListClient({ links }: AccessLinksListClientProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [durationDays, setDurationDays] = useState(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleCopyToken(id: string, token: string) {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/vip/${token}`
        : `/vip/${token}`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
    }

    setCopiedId(id);
    showToast("success", `Enlace copiado: ${shareUrl}`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  }

  async function handleCreateLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isGenerating) return;

    setIsGenerating(true);
    const res = await createClientAccessLinkAction({
      clientName,
      durationDays,
    });
    setIsGenerating(false);

    if (!res.success) {
      showToast("error", res.message);
      return;
    }

    showToast("success", res.message);
    setClientName("");
    setDurationDays(7);
    setIsModalOpen(false);
    router.refresh();
  }

  async function handleDelete(linkId: string) {
    setDeletingId(linkId);
    const res = await deleteClientAccessLinkAction(linkId);
    setDeletingId(null);
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
            Enlaces Privados
          </h2>
          <p className="text-xs text-zinc-500">
            Tokens temporales para agencias y clientes autorizados.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-medium text-white shadow-xs transition-transform active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Generar</span>
        </button>
      </div>

      {/* Lista Real de Enlaces (`client_access_links`) */}
      {links.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <p className="text-xs font-medium text-zinc-600">
            No tienes enlaces activos todavía.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-medium text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Generar primer enlace VIP</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => {
            const isCopied = copiedId === link.id;
            const isExpired =
              new Date(link.expires_at).getTime() < Date.now();
            const formattedExpiry = new Date(
              link.expires_at
            ).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={link.id}
                className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider ${
                        isExpired ? "text-rose-600" : "text-emerald-600"
                      }`}
                    >
                      {isExpired ? "Token Expirado" : "Acceso Autorizado"}
                    </span>
                    <h3 className="mt-0.5 text-sm font-semibold text-zinc-900">
                      {link.client_name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyToken(link.id, link.unique_token)
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors active:scale-95 hover:bg-zinc-100"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-zinc-500" />
                          <span>Copiar Link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === link.id}
                      onClick={() => handleDelete(link.id)}
                      className="rounded-xl border border-zinc-200 p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-600"
                      title="Revocar enlace"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5 font-mono text-zinc-700">
                    <KeyRound className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{link.unique_token}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                    <CalendarClock className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Expira: {formattedExpiry}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Móvil para Generar Enlace Privado */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/50 p-4 backdrop-blur-xs sm:items-center">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-zinc-200">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-semibold text-zinc-900">
                Generar Enlace Privado VIP
              </h3>
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLink} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Nombre del Cliente o Agencia *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Agencia Elite Milán"
                  className="mt-1 h-10 w-full rounded-xl border border-zinc-200 px-3 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Duración del Acceso
                </label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {[
                    { days: 1, label: "24 Horas" },
                    { days: 7, label: "7 Días" },
                    { days: 30, label: "30 Días" },
                  ].map((opt) => (
                    <button
                      key={opt.days}
                      type="button"
                      onClick={() => setDurationDays(opt.days)}
                      className={`h-9 rounded-xl text-xs font-medium transition-colors ${
                        durationDays === opt.days
                          ? "bg-zinc-900 text-white"
                          : "border border-zinc-200 bg-zinc-50 text-zinc-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 flex-1 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-zinc-900 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Generando...</span>
                    </>
                  ) : (
                    <span>Crear Token</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
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
          <p className="flex-1 truncate text-xs font-medium">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
