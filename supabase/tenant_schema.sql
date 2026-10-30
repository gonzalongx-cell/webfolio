-- =============================================================================
-- WEBFOLIO · ESQUEMA DEL PORTAFOLIO, RLS MULTI-TENANT Y DATOS INICIALES
-- Copia y ejecuta todo este script en el SQL Editor de Supabase
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Permitir que cada modelo autenticada pueda leer su propio perfil en `public.profiles`
DROP POLICY IF EXISTS "tenant_select_own_profile" ON public.profiles;
CREATE POLICY "tenant_select_own_profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

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
-- 4. SEGURIDAD ROW LEVEL SECURITY (RLS) ESTRICTA (`auth.uid() = model_id`)
-- =============================================================================

ALTER TABLE public.portfolio_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_access_links ENABLE ROW LEVEL SECURITY;

-- Políticas para `portfolio_media`
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

-- Políticas para `skills_services`
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

-- Políticas para `client_access_links`
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

-- =============================================================================
-- 5. SEED INICIAL PARA VALENTINA MENDOZA (`c1c22f4c-d80b-40d0-a3db-3473c3e5b5be`)
-- =============================================================================
DO $$
DECLARE
  v_model_id UUID := 'c1c22f4c-d80b-40d0-a3db-3473c3e5b5be';
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_model_id) THEN
    -- Media inicial
    IF NOT EXISTS (SELECT 1 FROM public.portfolio_media WHERE model_id = v_model_id) THEN
      INSERT INTO public.portfolio_media (model_id, media_url, type) VALUES
        (v_model_id, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'photo'),
        (v_model_id, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', 'video'),
        (v_model_id, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', 'photo'),
        (v_model_id, 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80', 'photo');
    END IF;

    -- Servicios iniciales
    IF NOT EXISTS (SELECT 1 FROM public.skills_services WHERE model_id = v_model_id) THEN
      INSERT INTO public.skills_services (model_id, title, description, rate_amount, is_active) VALUES
        (v_model_id, 'Sesión Editorial / Lookbook (Full Day)', 'Jornada de 8 horas en estudio o locación. Incluye derechos digitales por 6 meses.', 950.00, true),
        (v_model_id, 'Pasarela & Showroom VIP', 'Fitting previo + desfile o presentación privada para compradores y prensa.', 600.00, true),
        (v_model_id, 'Contenido UGC & Reels de Marca', 'Grabación de 3 piezas verticales en alta definición con entrega en 48h.', 420.00, false);
    END IF;

    -- Enlaces iniciales
    IF NOT EXISTS (SELECT 1 FROM public.client_access_links WHERE model_id = v_model_id) THEN
      INSERT INTO public.client_access_links (model_id, unique_token, client_name, expires_at) VALUES
        (v_model_id, 'wf_tk_9a8f2c1e', 'Casa Editorial Condé Nast MX', NOW() + INTERVAL '10 days'),
        (v_model_id, 'wf_tk_4b7d19f0', 'Agencia L''Étoile Casting París', NOW() + INTERVAL '5 days');
    END IF;
  END IF;
END $$;
