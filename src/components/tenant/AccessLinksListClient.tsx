"use client";

import React, { useState } from "react";
import {
  Plus,
  Copy,
  Check,
  KeyRound,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";
import type { ClientAccessLinkItem } from "@/types/models";

interface AccessLinksListClientProps {
  links: ClientAccessLinkItem[];
}

export function AccessLinksListClient({ links }: AccessLinksListClientProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  async function handleCopyToken(id: string, token: string) {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/vip/${token}`
        : `/vip/${token}`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
    }

    setCopiedId(id);
    setCopiedUrl(shareUrl);
    setTimeout(() => {
      setCopiedId(null);
      setCopiedUrl(null);
    }, 2500);
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
            No tienes enlaces activos en `client_access_links`.
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">
            Genera un token privado para compartir tu portafolio con una agencia.
          </p>
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

                  <button
                    type="button"
                    onClick={() => handleCopyToken(link.id, link.unique_token)}
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

      {/* Toast al copiar URL al portapapeles */}
      {copiedUrl && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-2.5 rounded-xl border border-emerald-200 bg-white p-3.5 text-zinc-900 shadow-lg"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold">Enlace copiado al portapapeles</p>
            <p className="truncate font-mono text-[11px] text-zinc-500">
              {copiedUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
