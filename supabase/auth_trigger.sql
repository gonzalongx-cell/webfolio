-- =============================================================================
-- WEBFOLIO · SPRINT 6 (FASE 1): TRIGGER AUTOMÁTICO DE ONBOARDING (GOOGLE OAUTH)
-- Ejecuta este script en el SQL Editor de Supabase
-- =============================================================================

-- 1. Asegurar que la columna `avatar_url` exista en `public.profiles`
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Función PostgreSQL que sincroniza `auth.users` -> `public.profiles`
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
  v_avatar_url TEXT;
BEGIN
  -- Extraer `full_name` y `avatar_url` desde `new.raw_user_meta_data` (Google OAuth / Auth)
  v_full_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    SPLIT_PART(COALESCE(NEW.email, 'Nuevo Talento'), '@', 1)
  );

  v_avatar_url := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'picture'), '')
  );

  -- Insertar automáticamente en `public.profiles` forzando role = 'model' y status = 'pending'
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
    'model',
    'pending',
    v_full_name,
    COALESCE(NEW.email, ''),
    v_avatar_url,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
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
