import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para Client Components (Navegador).
 * Utiliza exclusivamente la llave pública `NEXT_PUBLIC_SUPABASE_ANON_KEY`
 * sujeta a políticas de Row Level Security (RLS) por tenant.
 */
export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Faltan las variables de entorno públicas de Supabase (NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY)."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
