import "server-only";
import { createSupabaseServerClient } from "./server";
import { createSupabaseAdminClient } from "./admin";
import type { ProfileRecord } from "@/types/models";

const SUPER_ADMIN_EMAIL = "gonzalezgex@gmail.com";

export interface TenantSessionContext {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  avatarUrl: string | null;
  profile: ProfileRecord | null;
}

/**
 * Obtiene el contexto de sesión del usuario autenticado y garantiza
 * que su perfil exista sincronizado en `public.profiles`.
 */
export async function getTenantSession(): Promise<TenantSessionContext> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        isAuthenticated: false,
        userId: null,
        email: null,
        avatarUrl: null,
        profile: null,
      };
    }

    const email = (user.email ?? "").toLowerCase();
    const isSuperAdmin = email === SUPER_ADMIN_EMAIL;

    const fullName =
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      email.split("@")[0] ||
      "Talento Webfolio";

    const metaAvatar =
      (user.user_metadata?.avatar_url as string | undefined) ||
      (user.user_metadata?.picture as string | undefined) ||
      null;

    const supabaseAdmin = createSupabaseAdminClient();

    // Consultar el perfil actual en `public.profiles`
    let { data: profile } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, role, status, full_name, contact_email, created_at, updated_at"
      )
      .eq("id", user.id)
      .maybeSingle();

    // Si aún no existe en `public.profiles` (ej. primer ingreso con Google OAuth), crearlo automáticamente
    if (!profile) {
      const { data: insertedProfile } = await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            id: user.id,
            role: isSuperAdmin ? "super_admin" : "model",
            status: isSuperAdmin ? "active" : "pending",
            full_name: fullName,
            contact_email: email,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
        .select(
          "id, role, status, full_name, contact_email, created_at, updated_at"
        )
        .maybeSingle();

      profile = insertedProfile;
    } else if (isSuperAdmin && profile.role !== "super_admin") {
      // Asegurar que gonzalezgex@gmail.com siempre tenga rol super_admin y estado active
      const { data: updatedAdmin } = await supabaseAdmin
        .from("profiles")
        .update({
          role: "super_admin",
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select(
          "id, role, status, full_name, contact_email, created_at, updated_at"
        )
        .maybeSingle();

      if (updatedAdmin) profile = updatedAdmin;
    }

    return {
      isAuthenticated: true,
      userId: user.id,
      email: user.email ?? null,
      avatarUrl: metaAvatar,
      profile: (profile as ProfileRecord) ?? null,
    };
  } catch {
    return {
      isAuthenticated: false,
      userId: null,
      email: null,
      avatarUrl: null,
      profile: null,
    };
  }
}
