import React from "react";
import Link from "next/link";
import {
  Eye,
  Link2,
  Images,
  Briefcase,
  ChevronRight,
  Plus,
  Clock,
} from "lucide-react";
import {
  MOCK_TENANT_MODEL,
  MOCK_PORTFOLIO_MEDIA,
  MOCK_SKILLS_SERVICES,
  MOCK_CLIENT_LINKS,
} from "@/lib/mock/tenant-data";

export default function TenantDashboardPage() {
  const activeServicesCount = MOCK_SKILLS_SERVICES.filter(
    (s) => s.is_active
  ).length;

  return (
    <div className="space-y-5">
      {/* Tarjeta Hero del Book Privado */}
      <div className="rounded-2xl bg-zinc-900 p-5 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            Resumen del Portafolio
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-zinc-200">
            {MOCK_TENANT_MODEL.handle}
          </span>
        </div>

        <p className="mt-2 text-xs text-zinc-300">
          {MOCK_TENANT_MODEL.location}
        </p>

        {/* Indicadores Rápidos */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 border-t border-white/10 pt-4">
          <div>
            <p className="text-[11px] text-zinc-400">Medios</p>
            <p className="mt-0.5 text-lg font-semibold">
              {MOCK_PORTFOLIO_MEDIA.length}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">Servicios</p>
            <p className="mt-0.5 text-lg font-semibold">
              {activeServicesCount} activos
            </p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">Enlaces VIP</p>
            <p className="mt-0.5 text-lg font-semibold">
              {MOCK_CLIENT_LINKS.length}
            </p>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas Táctiles */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/app/portafolio"
          className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs transition-transform active:scale-95"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white">
            <Plus className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-900">Subir Foto</p>
            <p className="truncate text-[11px] text-zinc-500">
              Actualizar book
            </p>
          </div>
        </Link>

        <Link
          href="/app/enlaces"
          className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs transition-transform active:scale-95"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
            <Link2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-900">Crear Token</p>
            <p className="truncate text-[11px] text-zinc-500">
              Acceso temporal
            </p>
          </div>
        </Link>
      </div>

      {/* Accesos Recientes de Clientes (Mock) */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Enlaces de Clientes Activos
          </h2>
          <Link
            href="/app/enlaces"
            className="inline-flex items-center text-xs font-medium text-zinc-900"
          >
            Ver todos
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-3 divide-y divide-zinc-100">
          {MOCK_CLIENT_LINKS.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-zinc-900">
                  {link.client_name}
                </p>
                <p className="mt-0.5 flex items-center gap-1 font-mono text-[11px] text-zinc-400">
                  <Clock className="h-3 w-3" />
                  Token: {link.unique_token}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                <Eye className="h-3 w-3" />
                Activo
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Vista Previa de Módulos */}
      <div className="space-y-2.5">
        <Link
          href="/app/portafolio"
          className="flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs transition-transform active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
              <Images className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900">
                Galería & Polaroids (`portfolio_media`)
              </p>
              <p className="text-[11px] text-zinc-500">
                {MOCK_PORTFOLIO_MEDIA.length} archivos publicados
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400" />
        </Link>

        <Link
          href="/app/servicios"
          className="flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs transition-transform active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900">
                Tarifario & Booking (`skills_services`)
              </p>
              <p className="text-[11px] text-zinc-500">
                {MOCK_SKILLS_SERVICES.length} servicios configurados
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400" />
        </Link>
      </div>
    </div>
  );
}
