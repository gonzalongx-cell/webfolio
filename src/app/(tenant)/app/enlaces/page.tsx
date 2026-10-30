"use client";

import React, { useState } from "react";
import { Plus, Copy, Check, KeyRound, CalendarClock } from "lucide-react";
import { MOCK_CLIENT_LINKS } from "@/lib/mock/tenant-data";

export default function TenantAccessLinksPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopyToken(id: string, token: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/vip/${token}`
      );
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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

      {/* Lista de Enlaces (`client_access_links`) */}
      <div className="space-y-3">
        {MOCK_CLIENT_LINKS.map((link) => {
          const isCopied = copiedId === link.id;
          const formattedExpiry = new Date(link.expires_at).toLocaleDateString(
            "es-ES",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          );

          return (
            <div
              key={link.id}
              className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                    Acceso Autorizado
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
    </div>
  );
}
