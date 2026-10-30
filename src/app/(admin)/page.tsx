import React from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { ModelRowActions } from "@/components/directory/ModelRowActions";
import type { TalentModel } from "@/types/models";

/**
 * Datos Mock iniciales (Sprint 1):
 * 3 filas representativas con los estados Activo, Pendiente y Suspendido.
 */
const MOCK_MODELS: TalentModel[] = [
  {
    id: "mod-001",
    fullName: "Valentina Mendoza",
    email: "valentina.mendoza@webfolio.talent",
    status: "Activo",
    tenantSlug: "valentina-m",
    location: "Ciudad de México · MX",
    updatedAt: "Hace 2 horas",
  },
  {
    id: "mod-002",
    fullName: "Sebastián Lindqvist",
    email: "s.lindqvist@webfolio.talent",
    status: "Pendiente",
    tenantSlug: "sebastian-l",
    location: "Madrid · ES",
    updatedAt: "Hace 1 día",
  },
  {
    id: "mod-003",
    fullName: "Camila Alarcón",
    email: "camila.alarcon@webfolio.talent",
    status: "Suspendido",
    tenantSlug: "camila-a",
    location: "Bogotá · CO",
    updatedAt: "Hace 5 días",
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function DirectorioModelosPage() {
  const columns: DataTableColumn<TalentModel>[] = [
    {
      key: "fullName",
      header: "Nombre Completo",
      render: (model) => (
        <div className="flex items-center gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
            {getInitials(model.fullName)}
          </div>
          <div>
            <div className="font-medium text-zinc-900">{model.fullName}</div>
            <div className="text-xs text-zinc-400">
              /{model.tenantSlug} · {model.location}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Correo",
      render: (model) => (
        <span className="font-mono text-xs text-zinc-600">{model.email}</span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (model) => <StatusBadge status={model.status} />,
    },
    {
      key: "actions",
      header: "Acciones",
      align: "right",
      render: (model) => <ModelRowActions model={model} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado de Sección */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Gestión Multi-Tenant
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
            Directorio de Modelos
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Administra los portafolios privados, accesos por tenant y el estado
            operativo de cada talento.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Mostrando</span>
          <span className="font-semibold text-zinc-900">
            {MOCK_MODELS.length} talentos
          </span>
          <span>registrados</span>
        </div>
      </div>

      {/* Resumen Rápido de Estados */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4">
          <p className="text-xs font-medium text-zinc-500">
            Portafolios Activos
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-zinc-900">1</span>
            <StatusBadge status="Activo" />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4">
          <p className="text-xs font-medium text-zinc-500">
            Revisión / Onboarding
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-zinc-900">1</span>
            <StatusBadge status="Pendiente" />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4">
          <p className="text-xs font-medium text-zinc-500">
            Cuentas Suspendidas
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-zinc-900">1</span>
            <StatusBadge status="Suspendido" />
          </div>
        </div>
      </div>

      {/* Tabla de Datos Principal */}
      <DataTable
        columns={columns}
        data={MOCK_MODELS}
        keyExtractor={(model) => model.id}
      />
    </div>
  );
}
