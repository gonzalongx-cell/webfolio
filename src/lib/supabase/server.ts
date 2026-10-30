import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * 1. Cliente Estándar de Servidor (Server Components, Server Actions, Route Handlers)
 * Respeta las políticas RLS del usuario/tenant autenticado mediante cookies.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Faltan las variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options?: CookieOptions }[]
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Llamado desde un Server Component donde no se pueden mutar cookies directamente.
        }
      },
    },
  });
}

/**
 * 2. Cliente Administrativo (Súper Administrador / Multi-Tenant Management)
 * Utiliza `SUPABASE_SERVICE_ROLE_KEY` para omitir RLS en operaciones privilegiadas:
 * - Aprovisionamiento de nuevos tenants/portafolios
 * - Suspensión global de cuentas o auditoría transversal
 * - Gestión de reservas logísticas entre tenants
 *
 * IMPORTANTE: Protegido con `import "server-only"` para impedir su empaquetado en el cliente.
 */
export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Configuración administrativa incompleta: asegúrate de definir NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el servidor."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
