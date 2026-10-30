import React from "react";
import { TopAppBar } from "./TopAppBar";
import { BottomNavBar } from "./BottomNavBar";
import type { TenantSessionContext } from "@/lib/supabase/tenant-session";

interface TenantAppShellProps {
  session: TenantSessionContext;
  children: React.ReactNode;
}

/**
 * App Shell Mobile-First para la PWA del Talento (Modelo).
 * Recibe el contexto de sesión real obtenido con el cliente estándar de Supabase.
 */
export function TenantAppShell({ session, children }: TenantAppShellProps) {
  const displayName =
    session.profile?.full_name || session.email || "Talento Webfolio";

  return (
    <div className="min-h-dvh bg-zinc-100/80 text-zinc-900 antialiased">
      {/* Contenedor central Mobile-First */}
      <div className="relative mx-auto min-h-dvh max-w-md bg-zinc-50 shadow-xl ring-1 ring-zinc-200/80">
        {/* Barra Superior Fija */}
        <TopAppBar
          isAuthenticated={session.isAuthenticated}
          fullName={displayName}
          email={session.email}
          avatarUrl={session.avatarUrl}
        />

        {/* Área de Contenido Fluida con Padding para no cortarse con las barras fijas */}
        <main className="px-4 pt-20 pb-24">{children}</main>

        {/* Barra de Navegación Inferior Fija */}
        <BottomNavBar />
      </div>
    </div>
  );
}
