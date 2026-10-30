import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Inicializa el cliente administrativo de Supabase para el Súper Administrador.
 * Utiliza `SUPABASE_SERVICE_ROLE_KEY` para omitir Row Level Security (RLS)
 * y consultar/gestionar todos los perfiles y tenants desde el servidor.
 */
export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Variables faltantes: asegúrate de configurar NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en tu entorno (.env.local / Vercel)."
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
