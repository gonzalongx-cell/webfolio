"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  Sparkles,
  LogOut,
  Loader2,
  X,
} from "lucide-react";
import { signOutTenantModelAction } from "@/app/(tenant)/app/actions";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const SUPERADMIN_NAV_ITEMS: NavItem[] = [
  {
    label: "Directorio de Modelos",
    href: "/",
    icon: Users,
  },
  {
    label: "Métricas",
    href: "/metricas",
    icon: BarChart3,
  },
  {
    label: "Configuración",
    href: "/configuracion",
    icon: Settings,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  adminEmail?: string;
  adminName?: string;
}

export function Sidebar({
  isOpen,
  onClose,
  adminEmail = "gonzalezgex@gmail.com",
  adminName = "Súper Administrador",
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, startSignOut] = useTransition();

  function handleLogout() {
    startSignOut(async () => {
      await signOutTenantModelAction();
      router.replace("/login");
    });
  }

  return (
    <>
      {/* Backdrop móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Contenedor lateral */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200/80 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Cabecera de Marca */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-200/70 px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight text-zinc-900">
                Webfolio
              </span>
              <span className="ml-1.5 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                Root
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden"
            aria-label="Cerrar menú lateral"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navegación Principal */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Consola Multi-Tenant
          </div>
          <nav className="space-y-1" aria-label="Menú del Súper Administrador">
            {SUPERADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-2xs"
                      : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-zinc-400 group-hover:text-zinc-700"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        isActive
                          ? "bg-zinc-800 text-zinc-200"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Pie del Sidebar: Identidad del Súper Administrador + Cerrar Sesión */}
        <div className="border-t border-zinc-200/70 p-4 space-y-2.5">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3 ring-1 ring-inset ring-zinc-200/70">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-zinc-900">
                {adminName}
              </p>
              <p className="truncate font-mono text-[11px] text-zinc-500">
                {adminEmail}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSigningOut}
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50"
          >
            {isSigningOut ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
