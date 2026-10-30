import React from "react";
import { TenantAppShell } from "@/components/tenant/TenantAppShell";
import { getTenantSession } from "@/lib/supabase/tenant-session";

export const dynamic = "force-dynamic";

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getTenantSession();

  return <TenantAppShell session={session}>{children}</TenantAppShell>;
}
