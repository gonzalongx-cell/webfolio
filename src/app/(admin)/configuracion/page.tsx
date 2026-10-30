import React from "react";
import { Settings } from "lucide-react";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Sistema y Seguridad
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          Configuración Global
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Parámetros multi-tenant, dominios personalizados y políticas de acceso
          para portafolios privados.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
          <Settings className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-sm font-semibold text-zinc-900">
          Configuración del Súper Administrador
        </h2>
        <p className="mt-1 max-w-md text-xs text-zinc-500">
          Los ajustes globales de tenants, políticas RLS y llaves operativas se
          gestionarán desde este panel.
        </p>
      </div>
    </div>
  );
}
