"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Menu, Plus, Search, Smartphone } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/Button";
import {
  InviteModelSlideOver,
  ToastViewport,
  type ToastNotification,
} from "@/components/directory/InviteModelSlideOver";

interface SuperAdminShellProps {
  children: React.ReactNode;
}

export function SuperAdminShell({ children }: SuperAdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const handleNotify = useCallback((toast: Omit<ToastNotification, "id">) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 5000);
  }, []);

  const handleDismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-50/60 text-zinc-900 antialiased">
      {/* Menú Lateral Responsivo */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Área de Contenido Principal */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar Minimalista */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200/80 bg-white/85 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                placeholder="Buscar talento, correo o tenant..."
                className="h-9 w-64 rounded-lg border border-zinc-200 bg-zinc-50/60 pl-9 pr-3 text-xs text-zinc-800 placeholder:text-zinc-400 transition-colors focus:border-zinc-400 focus:bg-white focus:outline-none md:w-80"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            >
              <Smartphone className="h-3.5 w-3.5 text-zinc-500" />
              <span>PWA Modelo</span>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setInviteOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nuevo Portafolio</span>
            </Button>
          </div>
        </header>

        {/* Contenido de la Vista */}
        <main className="flex-1 px-4 py-8 sm:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Slide-over de Invitación de Talento (Onboarding Manual) */}
      <InviteModelSlideOver
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onNotify={handleNotify}
      />

      {/* Sistema de Notificaciones Visuales (Toasts) */}
      <ToastViewport toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
