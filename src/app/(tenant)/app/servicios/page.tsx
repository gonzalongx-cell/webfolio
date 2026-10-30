import React from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTenantSession } from "@/lib/supabase/tenant-session";
import { SessionAuthPrompt } from "@/components/tenant/SessionAuthPrompt";
import { ServicesListClient } from "@/components/tenant/ServicesListClient";
import type { SkillServiceItem } from "@/types/models";

export const dynamic = "force-dynamic";

export default async function TenantServicesPage() {
  const session = await getTenantSession();
  const supabase = await createSupabaseServerClient();

  // SELECT a `skills_services` usando el cliente estándar sujeto a RLS (`auth.uid() = model_id`)
  const { data } = await supabase
    .from("skills_services")
    .select("id, model_id, title, description, rate_amount, is_active")
    .order("created_at", { ascending: true });

  const services = (data as SkillServiceItem[]) ?? [];

  return (
    <div className="space-y-4">
      {!session.isAuthenticated && <SessionAuthPrompt />}
      <ServicesListClient initialServices={services} />
    </div>
  );
}
