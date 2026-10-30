import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const SUPER_ADMIN_EMAIL = "gonzalezgex@gmail.com";

/**
 * Route Handler para el flujo PKCE de Google OAuth en Supabase.
 * - Si el usuario es `gonzalezgex@gmail.com`, sincroniza su perfil como `super_admin` (`active`) y redirige a `/`.
 * - Cualquier otro correo se sincroniza como `model` (`pending` en primer ingreso) y redirige a `/app`.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;
      const email = (user.email ?? "").toLowerCase();
      const isSuperAdmin = email === SUPER_ADMIN_EMAIL;

      const fullName =
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        email.split("@")[0] ||
        "Usuario Webfolio";

      try {
        const supabaseAdmin = createSupabaseAdminClient();

        if (isSuperAdmin) {
          await supabaseAdmin.from("profiles").upsert(
            {
              id: user.id,
              role: "super_admin",
              status: "active",
              full_name: fullName,
              contact_email: email,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );
        } else {
          const { data: existingProfile } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

          if (!existingProfile) {
            await supabaseAdmin.from("profiles").insert({
              id: user.id,
              role: "model",
              status: "pending",
              full_name: fullName,
              contact_email: email,
            });
          }
        }
      } catch {
        // Fallback silencioso
      }

      return NextResponse.redirect(
        `${origin}${isSuperAdmin ? "/" : "/app"}`
      );
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_error`);
}
