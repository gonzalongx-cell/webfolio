import React from "react";
import type { ModelStatus } from "@/types/models";

type BadgeVariant = "success" | "warning" | "danger" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  withDot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  success: {
    container: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  warning: {
    container: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
    dot: "bg-amber-500",
  },
  danger: {
    container: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
    dot: "bg-rose-500",
  },
  neutral: {
    container: "bg-zinc-100 text-zinc-700 ring-1 ring-inset ring-zinc-500/20",
    dot: "bg-zinc-500",
  },
};

export function Badge({
  children,
  variant = "neutral",
  withDot = true,
  className = "",
}: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight ${styles.container} ${className}`}
    >
      {withDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

/**
 * Helper reutilizable para mapear el estado del modelo al estilo semántico del Badge.
 */
export function StatusBadge({ status }: { status: ModelStatus }) {
  const statusToVariant: Record<ModelStatus, BadgeVariant> = {
    Activo: "success",
    Pendiente: "warning",
    Suspendido: "danger",
  };

  return <Badge variant={statusToVariant[status]}>{status}</Badge>;
}
