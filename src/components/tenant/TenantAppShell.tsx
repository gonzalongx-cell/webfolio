import React from "react";
import { TopAppBar } from "./TopAppBar";
import { BottomNavBar } from "./BottomNavBar";

interface TenantAppShellProps {
  children: React.ReactNode;
}

/**
 * App Shell Mobile-First para la PWA del Talento (Modelo).
 * En pantallas de escritorio se centra en un contenedor móvil (`max-w-md`)
 * simulando la experiencia nativa de un dispositivo táctil.
 */
export function TenantAppShell({ children }: TenantAppShellProps) {
  return (
    <div className="min-h-dvh bg-zinc-100/80 text-zinc-900 antialiased">
      {/* Contenedor central Mobile-First */}
      <div className="relative mx-auto min-h-dvh max-w-md bg-zinc-50 shadow-xl ring-1 ring-zinc-200/80">
        {/* Barra Superior Fija */}
        <TopAppBar />

        {/* Área de Contenido Fluida con Padding para no cortarse con las barras fijas */}
        <main className="px-4 pt-20 pb-24">{children}</main>

        {/* Barra de Navegación Inferior Fija */}
        <BottomNavBar />
      </div>
    </div>
  );
}
