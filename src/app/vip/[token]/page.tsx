import React from "react";
import { ShieldAlert, Sparkles, DollarSign, CalendarClock } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { VipPortfolioGallery } from "@/components/vip/VipPortfolioGallery";
import type { PortfolioMediaItem, SkillServiceItem } from "@/types/models";

export const dynamic = "force-dynamic";

export default async function VipTokenPortfolioPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabaseAdmin = createSupabaseAdminClient();

  const { data: linkData } = await supabaseAdmin
    .from("client_access_links")
    .select("id, model_id, unique_token, client_name, expires_at")
    .eq("unique_token", token)
    .maybeSingle();

  const isExpired =
    !linkData || new Date(linkData.expires_at).getTime() < Date.now();

  if (!linkData || isExpired) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
          <ShieldAlert className="h-6 w-6 text-rose-400" />
        </div>
        <h1 className="mt-4 text-lg font-semibold">
          Enlace Privado Inválido o Expirado
        </h1>
        <p className="mt-2 max-w-xs text-xs text-zinc-400">
          Este token de acceso a Webfolio ya no se encuentra vigente. Solicita
          un nuevo enlace al talento.
        </p>
      </div>
    );
  }

  const [profileRes, mediaRes, servicesRes] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("full_name, contact_email, status")
      .eq("id", linkData.model_id)
      .maybeSingle(),
    supabaseAdmin
      .from("portfolio_media")
      .select("id, model_id, media_url, type, created_at")
      .eq("model_id", linkData.model_id)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("skills_services")
      .select("id, model_id, title, description, rate_amount, is_active")
      .eq("model_id", linkData.model_id)
      .eq("is_active", true),
  ]);

  const modelName = profileRes.data?.full_name ?? "Portafolio Webfolio";
  const mediaItems = (mediaRes.data as PortfolioMediaItem[]) ?? [];
  const activeServices = (servicesRes.data as SkillServiceItem[]) ?? [];

  return (
    <div className="min-h-dvh bg-zinc-950 text-white antialiased">
      <div className="mx-auto max-w-md px-5 py-8 space-y-6">
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-zinc-950">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold">{modelName}</p>
              <p className="text-[11px] text-zinc-400">
                Acceso exclusivo para {linkData.client_name}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
            <CalendarClock className="h-3 w-3" />
            VIP Activo
          </span>
        </header>

        {/* Galería Interactiva con Lightbox y Carrusel */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Book & Galería ({mediaItems.length})
            </h2>
            {mediaItems.length > 0 && (
              <span className="text-[11px] text-zinc-500">
                Toca una foto para ampliar
              </span>
            )}
          </div>
          <VipPortfolioGallery mediaItems={mediaItems} modelName={modelName} />
        </section>

        {/* Servicios Activos */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Servicios y Tarifas ({activeServices.length})
          </h2>
          <div className="space-y-2.5">
            {activeServices.map((srv) => (
              <div
                key={srv.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    {srv.title}
                  </h3>
                  <span className="inline-flex items-center gap-0.5 rounded-lg bg-white/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                    <DollarSign className="h-3 w-3" />
                    {Number(srv.rate_amount).toLocaleString("en-US")} USD
                  </span>
                </div>
                {srv.description && (
                  <p className="mt-1.5 text-xs text-zinc-400">
                    {srv.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
