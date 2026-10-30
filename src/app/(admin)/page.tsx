import React from "react";
import { AlertCircle } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { ModelRowActions } from "@/components/directory/ModelRowActions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ProfileRecord } from "@/types/models";

// Fuerza renderizado dinámico para consultar datos en tiempo real desde Supabase
export const dynamic = "force-dynamic";

const SUPER_ADMIN_EMAIL = "gonzalezgex@gmail.com";

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

async function getProfilesDirectory(): Promise<{
  profiles: ProfileRecord[];
  errorMessage: string | null;
}> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return {
      profiles: [],
      errorMessage:
        "Configura NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en tus variables de entorno para consultar la tabla profiles en tiempo real.",
    };
  }

  try {
    const supabaseAdmin = createSupabaseAdminClient();

    // Sincronizar automáticamente cualquier usuario de auth.users que aún no esté en public.profiles
    const { data: authUsersData } = await supabaseAdmin.auth.admin.listUsers();
    const { data: existingProfiles } = await supabaseAdmin
      .from("profiles")
      .select("id");

    if (authUsersData?.users && existingProfiles) {
      const existingIds = new Set(existingProfiles.map((p) => p.id));
      const missingUsers = authUsersData.users.filter(
        (u) => !existingIds.has(u.id)
      );

      for (const u of missingUsers) {
        const email = (u.email ?? "").toLowerCase();
        const isSuperAdmin = email === SUPER_ADMIN_EMAIL;
        const fullName =
          (u.user_metadata?.full_name as string | undefined) ||
          (u.user_metadata?.name as string | undefined) ||
          email.split("@")[0] ||
          "Nuevo Talento";

        await supabaseAdmin.from("profiles").upsert(
          {
            id: u.id,
            role: isSuperAdmin ? "super_admin" : "model",
            status: isSuperAdmin ? "active" : "pending",
            full_name: fullName,
            contact_email: email,
          },
          { onConflict: "id" }
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, role, status, full_name, contact_email, created_at, updated_at"
      )
      .eq("role", "model")
      .order("created_at", { ascending: false });

    if (error) {
      return {
        profiles: [],
        errorMessage: `Error consultando public.profiles: ${error.message}`,
      };
    }

    return {
      profiles: (data as ProfileRecord[]) ?? [],
      errorMessage: null,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Error desconocido al conectar con Supabase.";
    return {
      profiles: [],
      errorMessage: message,
    };
  }
}

export default async function DirectorioModelosPage() {
  const { profiles, errorMessage } = await getProfilesDirectory();

  // Cálculo real de tarjetas de resumen a partir de `public.profiles`
  const activeCount = profiles.filter((p) => p.status === "active").length;
  const pendingCount = profiles.filter((p) => p.status === "pending").length;
  const suspendedCount = profiles.filter(
    (p) => p.status === "suspended"
  ).length;

  const columns: DataTableColumn<ProfileRecord>[] = [
    {
      key: "full_name",
      header: "Nombre Completo",
      render: (profile) => (
        <div className="flex items-center gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
            {getInitials(profile.full_name || "TM")}
          </div>
          <div>
            <div className="font-medium text-zinc-900">{profile.full_name}</div>
            <div className="font-mono text-[11px] text-zinc-400">
              ID: {profile.id.slice(0, 8)} · Rol: {profile.role}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "contact_email",
      header: "Correo",
      render: (profile) => (
        <span className="font-mono text-xs text-zinc-600">
          {profile.contact_email}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (profile) => <StatusBadge status={profile.status} />,
    },
    {
      key: "actions",
      header: "Acciones",
      align: "right",
      render: (profile) => <ModelRowActions profile={profile} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado de Sección */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Gestión Multi-Tenant · Supabase Live
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
            Directorio de Modelos
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Administra los portafolios privados, accesos por tenant y el estado
            operativo de cada talento en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Mostrando</span>
          <span className="font-semibold text-zinc-900">
            {profiles.length} {profiles.length === 1 ? "talento" : "talentos"}
          </span>
          <span>en base de datos</span>
        </div>
      </div>

      {/* Aviso de diagnóstico si aún no están configuradas las variables o la tabla */}
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold">Conexión a Supabase pendiente</p>
            <p className="mt-0.5 text-amber-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Resumen Real de Estados */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4">
          <p className="text-xs font-medium text-zinc-500">
            Portafolios Activos
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-zinc-900">
              {activeCount}
            </span>
            <StatusBadge status="active" />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4">
          <p className="text-xs font-medium text-zinc-500">
            Revisión / Pendientes
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-zinc-900">
              {pendingCount}
            </span>
            <StatusBadge status="pending" />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4">
          <p className="text-xs font-medium text-zinc-500">
            Cuentas Suspendidas
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-zinc-900">
              {suspendedCount}
            </span>
            <StatusBadge status="suspended" />
          </div>
        </div>
      </div>

      {/* Tabla de Datos Conectada a `public.profiles` */}
      <DataTable
        columns={columns}
        data={profiles}
        keyExtractor={(profile) => profile.id}
        emptyMessage="No hay modelos registrados en la tabla 'profiles' todavía."
      />
    </div>
  );
}
