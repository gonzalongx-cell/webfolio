import React from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTenantSession } from "@/lib/supabase/tenant-session";
import { SessionAuthPrompt } from "@/components/tenant/SessionAuthPrompt";
import { AccessLinksListClient } from "@/components/tenant/AccessLinksListClient";
import type { ClientAccessLinkItem } from "@/types/models";

export const dynamic = "force-dynamic";

export default async function TenantAccessLinksPage() {
  const session = await getTenantSession();
  const supabase = await createSupabaseServerClient();

  // SELECT a `client_access_links` usando el cliente estándar sujeto a RLS (`auth.uid() = model_id`)
  const { data } = await supabase
    .from("client_access_links")
    .select("id, model_id, unique_token, client_name, expires_at")
    .order("expires_at", { ascending: true });

  const links = (data as ClientAccessLinkItem[]) ?? [];

  return (
    <div className="space-y-4">
      {!session.isAuthenticated && <SessionAuthPrompt />}
      <AccessLinksListClient links={links} />
    </div>
  );
}
