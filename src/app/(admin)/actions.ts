"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ProfileStatus } from "@/types/models";

/**
 * Server Action administrativa para cambiar el estado de un perfil en `public.profiles`.
 * Utiliza `createSupabaseAdminClient` (service_role) para operar transversalmente.
 */
export async function updateProfileStatusAction(
  profileId: string,
  newStatus: ProfileStatus
) {
  const supabaseAdmin = createSupabaseAdminClient();

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId);

  if (error) {
    throw new Error(`Error al actualizar el estado del perfil: ${error.message}`);
  }

  revalidatePath("/");
}
