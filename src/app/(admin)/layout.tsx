import React from "react";
import { redirect } from "next/navigation";
import { SuperAdminShell } from "@/components/layout/SuperAdminShell";
import { getTenantSession } from "@/lib/supabase/tenant-session";

export const dynamic = "force-dynamic";

const SUPER_ADMIN_EMAIL = "gonzalezgex@gmail.com";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getTenantSession();

  // 1. Sin sesión -> redirigir a `/login`
  if (!session.isAuthenticated) {
    redirect("/login");
  }

  // 2. Verificar que el usuario sea estrictamente `gonzalezgex@gmail.com` o tenga rol `super_admin`
  const isSuperAdmin =
    session.email?.toLowerCase() === SUPER_ADMIN_EMAIL ||
    session.profile?.role === "super_admin";

  if (!isSuperAdmin) {
    redirect("/app");
  }

  return (
    <SuperAdminShell
      adminEmail={session.email ?? SUPER_ADMIN_EMAIL}
      adminName={session.profile?.full_name ?? "Súper Administrador"}
    >
      {children}
    </SuperAdminShell>
  );
}
