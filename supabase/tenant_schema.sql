-- =============================================================================
-- WEBFOLIO · SPRINT 4 (FASE 1): ESQUEMA DEL PORTAFOLIO Y RLS MULTI-TENANT
-- Ejecuta este script en el SQL Editor de Supabase
-- =============================================================================

-- Asegurar extensión para generación de UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. Tabla `portfolio_media` (Fotos y Videos del Book de la Modelo)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_media_model_id
  ON public.portfolio_media(model_id);

-- -----------------------------------------------------------------------------
-- 2. Tabla `skills_services` (Servicios, Tarifas y Especialidades)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  rate_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (rate_amount >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_services_model_id
  ON public.skills_services(model_id);

-- -----------------------------------------------------------------------------
-- 3. Tabla `client_access_links` (Enlaces Privados Temporales para Clientes/Agencias)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.client_access_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  unique_token TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_access_links_model_id
  ON public.client_access_links(model_id);
CREATE INDEX IF NOT EXISTS idx_client_access_links_token
  ON public.client_access_links(unique_token);

-- =============================================================================
-- 4. SEGURIDAD ROW LEVEL SECURITY (RLS) ESTRICTA POR TENANT (`auth.uid() = model_id`)
-- =============================================================================

ALTER TABLE public.portfolio_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_access_links ENABLE ROW LEVEL SECURITY;

-- Políticas para `portfolio_media` (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "tenant_select_own_media" ON public.portfolio_media;
DROP POLICY IF EXISTS "tenant_insert_own_media" ON public.portfolio_media;
DROP POLICY IF EXISTS "tenant_update_own_media" ON public.portfolio_media;
DROP POLICY IF EXISTS "tenant_delete_own_media" ON public.portfolio_media;

CREATE POLICY "tenant_select_own_media"
  ON public.portfolio_media FOR SELECT TO authenticated
  USING (auth.uid() = model_id);

CREATE POLICY "tenant_insert_own_media"
  ON public.portfolio_media FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = model_id);

CREATE POLICY "tenant_update_own_media"
  ON public.portfolio_media FOR UPDATE TO authenticated
  USING (auth.uid() = model_id)
  WITH CHECK (auth.uid() = model_id);

CREATE POLICY "tenant_delete_own_media"
  ON public.portfolio_media FOR DELETE TO authenticated
  USING (auth.uid() = model_id);

-- Políticas para `skills_services` (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "tenant_select_own_services" ON public.skills_services;
DROP POLICY IF EXISTS "tenant_insert_own_services" ON public.skills_services;
DROP POLICY IF EXISTS "tenant_update_own_services" ON public.skills_services;
DROP POLICY IF EXISTS "tenant_delete_own_services" ON public.skills_services;

CREATE POLICY "tenant_select_own_services"
  ON public.skills_services FOR SELECT TO authenticated
  USING (auth.uid() = model_id);

CREATE POLICY "tenant_insert_own_services"
  ON public.skills_services FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = model_id);

CREATE POLICY "tenant_update_own_services"
  ON public.skills_services FOR UPDATE TO authenticated
  USING (auth.uid() = model_id)
  WITH CHECK (auth.uid() = model_id);

CREATE POLICY "tenant_delete_own_services"
  ON public.skills_services FOR DELETE TO authenticated
  USING (auth.uid() = model_id);

-- Políticas para `client_access_links` (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "tenant_select_own_links" ON public.client_access_links;
DROP POLICY IF EXISTS "tenant_insert_own_links" ON public.client_access_links;
DROP POLICY IF EXISTS "tenant_update_own_links" ON public.client_access_links;
DROP POLICY IF EXISTS "tenant_delete_own_links" ON public.client_access_links;

CREATE POLICY "tenant_select_own_links"
  ON public.client_access_links FOR SELECT TO authenticated
  USING (auth.uid() = model_id);

CREATE POLICY "tenant_insert_own_links"
  ON public.client_access_links FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = model_id);

CREATE POLICY "tenant_update_own_links"
  ON public.client_access_links FOR UPDATE TO authenticated
  USING (auth.uid() = model_id)
  WITH CHECK (auth.uid() = model_id);

CREATE POLICY "tenant_delete_own_links"
  ON public.client_access_links FOR DELETE TO authenticated
  USING (auth.uid() = model_id);
