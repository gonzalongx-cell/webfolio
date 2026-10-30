-- =============================================================================
-- WEBFOLIO · SPRINT 6: TRIGGER AUTOMÁTICO DE ONBOARDING + SUPER ADMIN (GOOGLE OAUTH)
-- Ejecuta este script en el SQL Editor de Supabase
-- =============================================================================

-- 1. Asegurar que la columna `avatar_url` exista en `public.profiles`
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Función PostgreSQL que sincroniza `auth.users` -> `public.profiles`
-- Si el correo es `gonzalezgex@gmail.com`, asigna automáticamente `super_admin` y `active`.
-- Cualquier otro correo entra como `model` y `pending`.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
  v_avatar_url TEXT;
  v_role TEXT;
  v_status TEXT;
BEGIN
  v_full_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    SPLIT_PART(COALESCE(NEW.email, 'Nuevo Talento'), '@', 1)
  );

  v_avatar_url := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'picture'), '')
  );

  IF LOWER(COALESCE(NEW.email, '')) = 'gonzalezgex@gmail.com' THEN
    v_role := 'super_admin';
    v_status := 'active';
  ELSE
    v_role := 'model';
    v_status := 'pending';
  END IF;

  INSERT INTO public.profiles (
    id,
    role,
    status,
    full_name,
    contact_email,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    v_role,
    v_status,
    v_full_name,
    LOWER(COALESCE(NEW.email, '')),
    v_avatar_url,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    role = CASE
      WHEN LOWER(COALESCE(NEW.email, '')) = 'gonzalezgex@gmail.com' THEN 'super_admin'
      ELSE public.profiles.role
    END,
    status = CASE
      WHEN LOWER(COALESCE(NEW.email, '')) = 'gonzalezgex@gmail.com' THEN 'active'
      ELSE public.profiles.status
    END,
    full_name = EXCLUDED.full_name,
    contact_email = EXCLUDED.contact_email,
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- 3. Crear el Trigger AFTER INSERT en `auth.users`
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();
