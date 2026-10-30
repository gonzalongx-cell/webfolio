"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getTenantSession } from "@/lib/supabase/tenant-session";
import type { ProfileStatus } from "@/types/models";

const SUPER_ADMIN_EMAIL = "gonzalezgex@gmail.com";

export interface ActionResult {
  success: boolean;
  message: string;
  profileId?: string;
}

async function isAuthorizedSuperAdmin(): Promise<boolean> {
  const session = await getTenantSession();
  if (!session.isAuthenticated) return false;
  return (
    session.email?.toLowerCase() === SUPER_ADMIN_EMAIL ||
    session.profile?.role === "super_admin"
  );
}

/**
 * 1. Server Action de Onboarding Manual:
 * Protegida exclusivamente para `gonzalezgex@gmail.com` (`super_admin`).
 */
export async function inviteTalentModelAction(formData: {
  fullName: string;
  email: string;
}): Promise<ActionResult> {
  if (!(await isAuthorizedSuperAdmin())) {
    return {
      success: false,
      message: "Acceso denegado: Se requieren privilegios de Súper Administrador.",
    };
  }

  const fullName = formData.fullName?.trim() ?? "";
  const email = formData.email?.trim().toLowerCase() ?? "";

  if (fullName.length < 2) {
    return {
      success: false,
      message:
        "Por favor ingresa el nombre completo del talento (mínimo 2 caracteres).",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Por favor ingresa un correo electrónico válido.",
    };
  }

  try {
    const supabaseAdmin = createSupabaseAdminClient();

    const { data: authData, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: {
          full_name: fullName,
          role: "model",
        },
      });

    if (inviteError || !authData?.user) {
      return {
        success: false,
        message:
          inviteError?.message ??
          "No se pudo enviar la invitación en Supabase Auth.",
      };
    }

    const userId = authData.user.id;

    const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        full_name: fullName,
        contact_email: email,
        role: "model",
        status: "pending",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (profileError) {
      return {
        success: false,
        message: `Usuario invitado en Auth, pero ocurrió un error al crear su perfil: ${profileError.message}`,
      };
    }

    revalidatePath("/");

    return {
      success: true,
      message: `Invitación enviada a ${email} y portafolio creado en estado Pendiente.`,
      profileId: userId,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Error inesperado al procesar la invitación.";
    return {
      success: false,
      message,
    };
  }
}

/**
 * 2. Server Action administrativa para cambiar el estado de un perfil en `public.profiles`.
 * Protegida exclusivamente para `gonzalezgex@gmail.com` (`super_admin`).
 */
export async function updateProfileStatusAction(
  profileId: string,
  newStatus: ProfileStatus
): Promise<ActionResult> {
  if (!(await isAuthorizedSuperAdmin())) {
    return {
      success: false,
      message: "Acceso denegado: Se requieren privilegios de Súper Administrador.",
    };
  }

  try {
    const supabaseAdmin = createSupabaseAdminClient();

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId);

    if (error) {
      return {
        success: false,
        message: `Error al actualizar el estado: ${error.message}`,
      };
    }

    revalidatePath("/");

    return {
      success: true,
      message: "Estado del portafolio actualizado correctamente.",
    };
  } catch (err) {
    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Error inesperado al actualizar estado.",
    };
  }
}
