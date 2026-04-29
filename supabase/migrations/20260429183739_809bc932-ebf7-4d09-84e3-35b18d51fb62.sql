-- 1. Add 'sponsor' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'sponsor';

-- 2. Sponsor plans catalog
CREATE TABLE public.sponsor_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL UNIQUE, -- 'bronce' | 'plata' | 'oro'
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'COP',
  description TEXT,
  monthly_push_limit INTEGER NOT NULL DEFAULT 0,
  main_banners INTEGER NOT NULL DEFAULT 0,
  geo_targeting BOOLEAN NOT NULL DEFAULT false,
  data_access_level TEXT NOT NULL DEFAULT 'basic', -- basic | advanced | full
  priority_support BOOLEAN NOT NULL DEFAULT false,
  features JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsor_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view sponsor plans"
ON public.sponsor_plans FOR SELECT USING (true);

CREATE POLICY "Admins manage sponsor plans"
ON public.sponsor_plans FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Sponsors table
CREATE TABLE public.sponsors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  brand_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  instagram TEXT,
  facebook TEXT,
  tiktok TEXT,
  logo_url TEXT,
  description TEXT,
  industry TEXT,
  status TEXT NOT NULL DEFAULT 'pendiente', -- pendiente | aprobado | rechazado | suspendido
  current_plan_id UUID REFERENCES public.sponsor_plans(id),
  plan_start_date DATE,
  plan_end_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all sponsors"
ON public.sponsors FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sponsors view own profile"
ON public.sponsors FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Sponsors insert own profile"
ON public.sponsors FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sponsors update own profile when approved"
ON public.sponsors FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND status = 'aprobado')
WITH CHECK (auth.uid() = user_id AND status = 'aprobado');

CREATE TRIGGER update_sponsors_updated_at
BEFORE UPDATE ON public.sponsors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sponsor_plans_updated_at
BEFORE UPDATE ON public.sponsor_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Sponsor campaigns
CREATE TABLE public.sponsor_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  target_audience TEXT NOT NULL DEFAULT 'both', -- businesses | customers | both
  category_filters TEXT[] DEFAULT '{}',
  zone_filters TEXT[] DEFAULT '{}',
  geo_enabled BOOLEAN NOT NULL DEFAULT false,
  geo_latitude NUMERIC,
  geo_longitude NUMERIC,
  geo_radius_km NUMERIC DEFAULT 5,
  scheduled_at TIMESTAMPTZ,
  cta_label TEXT,
  cta_action_type TEXT, -- url | message | call | whatsapp | place
  cta_action_value TEXT,
  status TEXT NOT NULL DEFAULT 'borrador', -- borrador | pendiente | aprobada | rechazada | enviada
  rejection_reason TEXT,
  sent_at TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsor_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all sponsor campaigns"
ON public.sponsor_campaigns FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sponsors manage own campaigns"
ON public.sponsor_campaigns FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.sponsors s WHERE s.id = sponsor_campaigns.sponsor_id AND s.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.sponsors s WHERE s.id = sponsor_campaigns.sponsor_id AND s.user_id = auth.uid()));

CREATE TRIGGER update_sponsor_campaigns_updated_at
BEFORE UPDATE ON public.sponsor_campaigns
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Plan contract requests
CREATE TABLE public.sponsor_plan_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.sponsor_plans(id),
  status TEXT NOT NULL DEFAULT 'pendiente', -- pendiente | aprobada | rechazada
  message TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsor_plan_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all plan requests"
ON public.sponsor_plan_requests FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sponsors manage own plan requests"
ON public.sponsor_plan_requests FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.sponsors s WHERE s.id = sponsor_plan_requests.sponsor_id AND s.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.sponsors s WHERE s.id = sponsor_plan_requests.sponsor_id AND s.user_id = auth.uid()));

CREATE TRIGGER update_sponsor_plan_requests_updated_at
BEFORE UPDATE ON public.sponsor_plan_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Storage bucket for sponsor logos & campaign images
INSERT INTO storage.buckets (id, name, public)
VALUES ('sponsor-assets', 'sponsor-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Sponsor assets are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'sponsor-assets');

CREATE POLICY "Authenticated can upload sponsor assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'sponsor-assets');

CREATE POLICY "Authenticated can update sponsor assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'sponsor-assets');

CREATE POLICY "Authenticated can delete sponsor assets"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'sponsor-assets');

-- 7. Seed the 3 sponsorship plans
INSERT INTO public.sponsor_plans (name, tier, price, description, monthly_push_limit, main_banners, geo_targeting, data_access_level, priority_support, features, display_order)
VALUES
('Patrocinio Bronce', 'bronce', 15000000, 'Plan de entrada con presencia activa en la app y campañas mensuales.', 4, 1, true, 'basic', false,
 '["4 notificaciones push al mes","1 banner principal rotativo","Segmentación geográfica básica","Reporte mensual de métricas","Logo en sección de patrocinadores"]'::jsonb, 1),
('Patrocinio Plata', 'plata', 30000000, 'Mayor visibilidad y datos avanzados para campañas más efectivas.', 10, 3, true, 'advanced', true,
 '["10 notificaciones push al mes","3 banners principales","Segmentación geo + categorías","Acceso a data avanzada","Soporte prioritario","Branding en eventos seleccionados"]'::jsonb, 2),
('Patrocinio Oro', 'oro', 50000000, 'Máxima exposición, datos completos y campañas ilimitadas con CTAs avanzados.', 30, 6, true, 'full', true,
 '["30 notificaciones push al mes","6 banners principales permanentes","Segmentación geo + categoría + zona","Acceso completo a data y analítica","Soporte dedicado","Branding en todos los eventos","CTAs avanzados (mensaje directo, llamada, WhatsApp)","Mención en Shorts y recomendaciones"]'::jsonb, 3);