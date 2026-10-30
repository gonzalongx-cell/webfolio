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
  AlertCircle,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTenantSession } from "@/lib/supabase/tenant-session";
import { SessionAuthPrompt } from "@/components/tenant/SessionAuthPrompt";
import type { ClientAccessLinkItem } from "@/types/models";

export const dynamic = "force-dynamic";

export default async function TenantDashboardPage() {
  const session = await getTenantSession();
  const supabase = await createSupabaseServerClient();

  // Consultas de conteo (count) sujetas a RLS con el cliente estándar
  const [
    mediaCountRes,
    totalServicesCountRes,
    activeServicesCountRes,
    linksCountRes,
    recentLinksRes,
  ] = await Promise.all([
    supabase
      .from("portfolio_media")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("skills_services")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("skills_services")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("client_access_links")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("client_access_links")
      .select("id, model_id, unique_token, client_name, expires_at")
      .order("expires_at", { ascending: true })
      .limit(3),
  ]);

  const mediaCount = mediaCountRes.count ?? 0;
  const totalServicesCount = totalServicesCountRes.count ?? 0;
  const activeServicesCount = activeServicesCountRes.count ?? 0;
  const linksCount = linksCountRes.count ?? 0;
  const recentLinks = (recentLinksRes.data as ClientAccessLinkItem[]) ?? [];

  const schemaError =
    mediaCountRes.error?.message ||
    totalServicesCountRes.error?.message ||
    linksCountRes.error?.message;

  return (
    <div className="space-y-5">
      {/* Si la modelo aún no ha iniciado sesión, mostrar tarjeta de acceso rápido RLS */}
      {!session.isAuthenticated && <SessionAuthPrompt />}

      {/* Si aún no se ha ejecutado el SQL de las 3 tablas en Supabase */}
      {schemaError && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50/90 p-3.5 text-xs text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold">Tablas del portafolio pendientes</p>
            <p className="mt-0.5 text-[11px] text-amber-700">
              Ejecuta el script `supabase/tenant_schema.sql` en el SQL Editor de
              Supabase ({schemaError}).
            </p>
          </div>
        </div>
      )}

      {/* Tarjeta Hero del Book Privado con Conteos Reales */}
      <div className="rounded-2xl bg-zinc-900 p-5 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            Resumen del Portafolio (RLS)
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-zinc-200">
            {session.profile?.status ?? "model"}
          </span>
        </div>

        <p className="mt-2 truncate font-mono text-xs text-zinc-300">
          {session.email ?? "Sin sesión autenticada"}
        </p>

        {/* Indicadores Rápidos desde Supabase (`count`) */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 border-t border-white/10 pt-4">
          <div>
            <p className="text-[11px] text-zinc-400">Medios</p>
            <p className="mt-0.5 text-lg font-semibold">{mediaCount}</p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">Servicios</p>
            <p className="mt-0.5 text-lg font-semibold">
              {activeServicesCount} activos
            </p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">Enlaces VIP</p>
            <p className="mt-0.5 text-lg font-semibold">{linksCount}</p>
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

      {/* Accesos Recientes de Clientes (Desde `client_access_links`) */}
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
          {recentLinks.length === 0 ? (
            <p className="py-3 text-xs text-zinc-400">
              No hay enlaces registrados para este perfil.
            </p>
          ) : (
            recentLinks.map((link) => (
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
            ))
          )}
        </div>
      </div>

      {/* Vista Previa de Módulos con Conteo Real */}
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
                {mediaCount} archivos publicados
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
                {totalServicesCount} servicios ({activeServicesCount} activos)
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400" />
        </Link>
      </div>
    </div>
  );
}
