import React from "react";
import { SuperAdminShell } from "@/components/layout/SuperAdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperAdminShell>{children}</SuperAdminShell>;
}
