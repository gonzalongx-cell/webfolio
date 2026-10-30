import React from "react";
import { redirect } from "next/navigation";
import { TenantAppShell } from "@/components/tenant/TenantAppShell";
import { PendingReviewScreen } from "@/components/tenant/PendingReviewScreen";
import { getTenantSession } from "@/lib/supabase/tenant-session";

export const dynamic = "force-dynamic";

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getTenantSession();

  // 1. Si el usuario no tiene sesión activa -> redirigir a `/login`
  if (!session.isAuthenticated) {
    redirect("/login");
  }

  // 2. Consultar su `status` en la tabla `profiles`
  const currentStatus = session.profile?.status ?? "pending";

  // 3. Pantalla de Retención: Si el status es 'pending' (o 'suspended'), NO renderizar el Dashboard
  if (currentStatus !== "active") {
    return <PendingReviewScreen session={session} status={currentStatus} />;
  }

  // 4. Si el status es 'active', renderizar el Dashboard y App Shell normalmente
  return <TenantAppShell session={session}>{children}</TenantAppShell>;
}
