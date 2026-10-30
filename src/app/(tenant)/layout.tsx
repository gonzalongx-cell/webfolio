import React from "react";
import { TenantAppShell } from "@/components/tenant/TenantAppShell";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TenantAppShell>{children}</TenantAppShell>;
}
