"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Images, Briefcase, Link2 } from "lucide-react";

interface TenantNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TENANT_NAV_ITEMS: TenantNavItem[] = [
  {
    label: "Dashboard",
    href: "/app",
    icon: LayoutGrid,
  },
  {
    label: "Portafolio",
    href: "/app/portafolio",
    icon: Images,
  },
  {
    label: "Servicios",
    href: "/app/servicios",
    icon: Briefcase,
  },
  {
    label: "Enlaces",
    href: "/app/enlaces",
    icon: Link2,
  },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación Principal del Talento"
      className="fixed bottom-0 inset-x-0 z-40"
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-around border-t border-zinc-200/80 bg-white/90 px-2 backdrop-blur-md">
        {TENANT_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex flex-1 flex-col items-center justify-center gap-1 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
                isActive
                  ? "text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-700"
              }`}
            >
              <div
                className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "bg-transparent text-zinc-500 group-hover:bg-zinc-100"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
