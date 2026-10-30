"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export interface TenantActionResult {
  success: boolean;
  message: string;
}

/**
 * Inicia sesión con el cliente estándar de Supabase
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
 * 1. PORTAFOLIO (`portfolio_media` + Bucket `portfolio-media`)
 */
export async function uploadPortfolioMediaAction(
  formData: FormData
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
        message: "Debes iniciar sesión para subir archivos a tu portafolio.",
      };
    }

    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return {
        success: false,
        message: "Selecciona una imagen o video válido.",
      };
    }

    const isVideo = file.type.startsWith("video/");
    const mediaType = isVideo ? "video" : "photo";
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${user.id}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    // Subir archivo al bucket `portfolio-media`
    const supabaseAdmin = createSupabaseAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabaseAdmin.storage
      .from("portfolio-media")
      .upload(filePath, arrayBuffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      return {
        success: false,
        message: `Error al subir archivo al bucket: ${uploadError.message}`,
      };
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("portfolio-media")
      .getPublicUrl(filePath);

    // Insertar registro en `public.portfolio_media`
    const { error: dbError } = await supabase.from("portfolio_media").insert({
      model_id: user.id,
      media_url: publicUrlData.publicUrl,
      type: mediaType,
    });

    if (dbError) {
      return {
        success: false,
        message: `El archivo se subió al bucket, pero falta crear la tabla portfolio_media en el SQL Editor (${dbError.message}).`,
      };
    }

    revalidatePath("/app/portafolio");
    revalidatePath("/app");

    return {
      success: true,
      message:
        mediaType === "video"
          ? "Video subido y publicado en tu portafolio."
          : "Foto subida y publicada en tu portafolio.",
    };
  } catch (err) {
    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Error inesperado al subir el archivo.",
    };
  }
}

export async function deletePortfolioMediaAction(
  mediaId: string
): Promise<TenantActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Sesión no válida." };
    }

    const { error } = await supabase
      .from("portfolio_media")
      .delete()
      .eq("id", mediaId)
      .eq("model_id", user.id);

    if (error) {
      return {
        success: false,
        message: `No se pudo eliminar: ${error.message}`,
      };
    }

    revalidatePath("/app/portafolio");
    revalidatePath("/app");
    return { success: true, message: "Archivo eliminado del portafolio." };
  } catch {
    return { success: false, message: "Error al eliminar el archivo." };
  }
}

/**
 * 2. SERVICIOS Y TARIFAS (`skills_services`)
 */
export async function createSkillServiceAction(payload: {
  title: string;
  description: string;
  rateAmount: number;
}): Promise<TenantActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Debes iniciar sesión para crear un servicio.",
      };
    }

    const title = payload.title.trim();
    const description = payload.description.trim();
    const rateAmount = Number(payload.rateAmount);

    if (title.length < 2) {
      return {
        success: false,
        message: "Ingresa un título válido para el servicio.",
      };
    }

    if (isNaN(rateAmount) || rateAmount < 0) {
      return {
        success: false,
        message: "Ingresa una tarifa válida en USD.",
      };
    }

    const { error } = await supabase.from("skills_services").insert({
      model_id: user.id,
      title,
      description,
      rate_amount: rateAmount,
      is_active: true,
    });

    if (error) {
      return {
        success: false,
        message: `Error al guardar en skills_services: asegúrate de haber ejecutado el SQL de las tablas (${error.message}).`,
      };
    }

    revalidatePath("/app/servicios");
    revalidatePath("/app");

    return {
      success: true,
      message: "Servicio creado y activado en tu tarifario.",
    };
  } catch (err) {
    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Error inesperado al crear el servicio.",
    };
  }
}

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

export async function deleteSkillServiceAction(
  serviceId: string
): Promise<TenantActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Sesión no válida." };
    }

    const { error } = await supabase
      .from("skills_services")
      .delete()
      .eq("id", serviceId)
      .eq("model_id", user.id);

    if (error) {
      return {
        success: false,
        message: `No se pudo eliminar el servicio: ${error.message}`,
      };
    }

    revalidatePath("/app/servicios");
    revalidatePath("/app");
    return { success: true, message: "Servicio eliminado." };
  } catch {
    return { success: false, message: "Error al eliminar el servicio." };
  }
}

/**
 * 3. ENLACES PRIVADOS (`client_access_links`)
 */
export async function createClientAccessLinkAction(payload: {
  clientName: string;
  durationDays: number;
}): Promise<TenantActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Debes iniciar sesión para generar enlaces privados.",
      };
    }

    const clientName = payload.clientName.trim();
    if (clientName.length < 2) {
      return {
        success: false,
        message: "Ingresa el nombre del cliente o agencia.",
      };
    }

    const days = Math.max(1, Math.min(90, Number(payload.durationDays) || 7));
    const expiresAt = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ).toISOString();
    const uniqueToken = `wf_tk_${crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 10)}`;

    const { error } = await supabase.from("client_access_links").insert({
      model_id: user.id,
      client_name: clientName,
      unique_token: uniqueToken,
      expires_at: expiresAt,
    });

    if (error) {
      return {
        success: false,
        message: `Error al guardar en client_access_links: asegúrate de haber ejecutado el SQL de las tablas (${error.message}).`,
      };
    }

    revalidatePath("/app/enlaces");
    revalidatePath("/app");

    return {
      success: true,
      message: `Enlace privado generado para ${clientName}.`,
    };
  } catch (err) {
    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Error inesperado al generar el enlace.",
    };
  }
}

export async function deleteClientAccessLinkAction(
  linkId: string
): Promise<TenantActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Sesión no válida." };
    }

    const { error } = await supabase
      .from("client_access_links")
      .delete()
      .eq("id", linkId)
      .eq("model_id", user.id);

    if (error) {
      return {
        success: false,
        message: `No se pudo revocar el enlace: ${error.message}`,
      };
    }

    revalidatePath("/app/enlaces");
    revalidatePath("/app");
    return { success: true, message: "Enlace privado revocado." };
  } catch {
    return { success: false, message: "Error al revocar el enlace." };
  }
}
