-- =============================================================================
-- WEBFOLIO · SPRINT 2: ESQUEMA INICIAL Y POLÍTICAS RLS (SUPABASE SQL EDITOR)
-- =============================================================================

-- 1. Crear la tabla `profiles` vinculada a `auth.users`
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'model' CHECK (role IN ('model', 'super_admin')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'suspended')),
  full_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para optimizar filtrados por rol y estado en el panel administrativo
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Función auxiliar SECURITY DEFINER para verificar si el usuario actual es `super_admin`
-- Evita recursión infinita al evaluar políticas sobre la misma tabla `profiles`.
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  );
$$;

-- 4. Política RLS: Acceso total (SELECT, INSERT, UPDATE, DELETE) SOLO para `super_admin`
DROP POLICY IF EXISTS "super_admin_full_access" ON public.profiles;

CREATE POLICY "super_admin_full_access"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());
