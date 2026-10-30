import "server-only";
import { createSupabaseServerClient } from "./server";
import type { ProfileRecord } from "@/types/models";

export interface TenantSessionContext {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  avatarUrl: string | null;
  profile: ProfileRecord | null;
}

/**
 * Obtiene el contexto de sesión de la modelo autenticada utilizando EXCLUSIVAMENTE
 * el cliente estándar de Supabase (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).
 * Todas las consultas subsecuentes quedan sujetas a las políticas RLS (`auth.uid() = model_id`).
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

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "id, role, status, full_name, contact_email, avatar_url, created_at, updated_at"
      )
      .eq("id", user.id)
      .maybeSingle();

    const metaAvatar =
      (user.user_metadata?.avatar_url as string | undefined) ||
      (user.user_metadata?.picture as string | undefined) ||
      null;

    return {
      isAuthenticated: true,
      userId: user.id,
      email: user.email ?? null,
      avatarUrl: (profile as ProfileRecord | null)?.avatar_url ?? metaAvatar,
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
