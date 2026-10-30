import React from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTenantSession } from "@/lib/supabase/tenant-session";
import { SessionAuthPrompt } from "@/components/tenant/SessionAuthPrompt";
import { PortfolioGridClient } from "@/components/tenant/PortfolioGridClient";
import type { PortfolioMediaItem } from "@/types/models";

export const dynamic = "force-dynamic";

export default async function TenantPortfolioPage() {
  const session = await getTenantSession();
  const supabase = await createSupabaseServerClient();

  // SELECT a `portfolio_media` usando el cliente estándar sujeto a RLS (`auth.uid() = model_id`)
  const { data } = await supabase
    .from("portfolio_media")
    .select("id, model_id, media_url, type, created_at")
    .order("created_at", { ascending: false });

  const mediaItems = (data as PortfolioMediaItem[]) ?? [];

  return (
    <div className="space-y-4">
      {!session.isAuthenticated && <SessionAuthPrompt />}
      <PortfolioGridClient mediaItems={mediaItems} />
    </div>
  );
}
