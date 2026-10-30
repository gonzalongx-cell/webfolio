import React from "react";
import { BarChart3 } from "lucide-react";

export default function MetricasPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Analítica Global
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          Métricas de Plataforma
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Indicadores de reservas logísticas, tráfico en portafolios privados y
          rendimiento por tenant.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
          <BarChart3 className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-sm font-semibold text-zinc-900">
          Módulo de Métricas (Próximo Sprint)
        </h2>
        <p className="mt-1 max-w-md text-xs text-zinc-500">
          Aquí se conectarán las vistas agregadas de Supabase mediante el
          cliente administrativo para monitorear reservas y actividad.
        </p>
      </div>
    </div>
  );
}
