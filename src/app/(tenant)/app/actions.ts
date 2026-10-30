"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface TenantActionResult {
  success: boolean;
  message: string;
}

/**
 * Inicia sesión con el cliente estándar de Supabase (NO service_role)
 * para establecer la cookie JWT que evalúa `auth.uid() = model_id` en RLS.
 */
export async function signInTenantModelAction(credentials?: {
  email?: string;
  password?: string;
}): Promise<TenantActionResult> {
  try {
    const supabase = await createSupabaseServerClient();

    const email =
      credentials?.email?.trim() || "valentina.mendoza@webfolio.talent";
    const password = credentials?.password || "WebfolioTempPassword2026!";

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: `Error de autenticación: ${error.message}`,
      };
    }

    revalidatePath("/app", "layout");
    return {
      success: true,
      message: `Sesión iniciada como ${email}`,
    };
  } catch (err) {
    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "No fue posible iniciar la sesión del talento.",
    };
  }
}

export async function signOutTenantModelAction(): Promise<TenantActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    revalidatePath("/app", "layout");
    return {
      success: true,
      message: "Sesión cerrada correctamente.",
    };
  } catch {
    return {
      success: false,
      message: "Error al cerrar la sesión.",
    };
  }
}

/**
 * Actualiza de forma asíncrona el campo booleano `is_active` en `public.skills_services`.
 * Utiliza el cliente estándar de Supabase para respetar estrictamente el RLS (`auth.uid() = model_id`).
 */
export async function toggleSkillServiceAction(
  serviceId: string,
  nextIsActive: boolean
): Promise<TenantActionResult> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message:
          "Debes iniciar sesión como modelo para modificar tus servicios (RLS activo).",
      };
    }

    const { data, error } = await supabase
      .from("skills_services")
      .update({ is_active: nextIsActive })
      .eq("id", serviceId)
      .eq("model_id", user.id)
      .select("id, is_active")
      .maybeSingle();

    if (error) {
      return {
        success: false,
        message: `No se pudo actualizar el servicio: ${error.message}`,
      };
    }

    if (!data) {
      return {
        success: false,
        message:
          "RLS bloqueó la operación o el servicio no pertenece a tu portafolio.",
      };
    }

    revalidatePath("/app/servicios");
    revalidatePath("/app");

    return {
      success: true,
      message: nextIsActive
        ? "Servicio activado y visible en tu portafolio."
        : "Servicio pausado temporalmente.",
    };
  } catch (err) {
    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Error de red al actualizar el servicio.",
    };
  }
}
