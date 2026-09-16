
-- Sellers
CREATE TABLE public.sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  full_name text NOT NULL,
  email text,
  phone text,
  document_id text,
  commission_percentage numeric NOT NULL DEFAULT 25,
  active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sellers TO authenticated;
GRANT ALL ON public.sellers TO service_role;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers view own profile" ON public.sellers
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Sellers create own profile" ON public.sellers
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Sellers update own profile" ON public.sellers
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete sellers" ON public.sellers
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON public.sellers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helper: is the current user this seller?
CREATE OR REPLACE FUNCTION public.is_seller_owner(_seller_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sellers s
    WHERE s.id = _seller_id AND s.user_id = auth.uid()
  )
$$;

REVOKE ALL ON FUNCTION public.is_seller_owner(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_seller_owner(uuid) TO authenticated;

-- Subscriptions: seller assignment, custom price, commission, collection
ALTER TABLE public.business_subscriptions
  ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES public.sellers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS custom_price numeric,
  ADD COLUMN IF NOT EXISTS commission_percentage numeric NOT NULL DEFAULT 25,
  ADD COLUMN IF NOT EXISTS collected boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS collected_at timestamptz,
  ADD COLUMN IF NOT EXISTS collected_amount numeric,
  ADD COLUMN IF NOT EXISTS seller_notes text;

CREATE INDEX IF NOT EXISTS business_subscriptions_seller_id_idx ON public.business_subscriptions(seller_id);

CREATE POLICY "Sellers view their subscriptions" ON public.business_subscriptions
  FOR SELECT TO authenticated
  USING (seller_id IS NOT NULL AND public.is_seller_owner(seller_id));
CREATE POLICY "Sellers update their subscriptions" ON public.business_subscriptions
  FOR UPDATE TO authenticated
  USING (seller_id IS NOT NULL AND public.is_seller_owner(seller_id))
  WITH CHECK (seller_id IS NOT NULL AND public.is_seller_owner(seller_id));

-- Videos delivered by sellers
CREATE TABLE public.seller_video_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  business_id uuid REFERENCES public.businesses(id) ON DELETE SET NULL,
  business_name text,
  title text NOT NULL,
  video_url text,
  delivered_at date NOT NULL DEFAULT current_date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.seller_video_deliveries TO authenticated;
GRANT ALL ON public.seller_video_deliveries TO service_role;
ALTER TABLE public.seller_video_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers manage own video deliveries" ON public.seller_video_deliveries
  FOR ALL TO authenticated
  USING (public.is_seller_owner(seller_id) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.is_seller_owner(seller_id) OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_seller_video_deliveries_updated_at BEFORE UPDATE ON public.seller_video_deliveries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Follow-up notes
CREATE TABLE public.seller_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  business_id uuid REFERENCES public.businesses(id) ON DELETE SET NULL,
  prospect_id uuid REFERENCES public.prospects(id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  subject text,
  content text NOT NULL,
  follow_up_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.seller_notes TO authenticated;
GRANT ALL ON public.seller_notes TO service_role;
ALTER TABLE public.seller_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers manage own notes" ON public.seller_notes
  FOR ALL TO authenticated
  USING (public.is_seller_owner(seller_id) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.is_seller_owner(seller_id) OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_seller_notes_updated_at BEFORE UPDATE ON public.seller_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Assign prospects and clients to sellers
ALTER TABLE public.prospects ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES public.sellers(id) ON DELETE SET NULL;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES public.sellers(id) ON DELETE SET NULL;

CREATE POLICY "Sellers manage their prospects" ON public.prospects
  FOR ALL TO authenticated
  USING (seller_id IS NOT NULL AND public.is_seller_owner(seller_id))
  WITH CHECK (seller_id IS NOT NULL AND public.is_seller_owner(seller_id));

CREATE POLICY "Sellers manage their clients" ON public.clients
  FOR ALL TO authenticated
  USING (seller_id IS NOT NULL AND public.is_seller_owner(seller_id))
  WITH CHECK (seller_id IS NOT NULL AND public.is_seller_owner(seller_id));

-- Allow 'seller' as a safe self-service role at signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  requested_role app_role;
  safe_role app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', ''));

  BEGIN
    requested_role := (new.raw_user_meta_data->>'role')::app_role;
  EXCEPTION WHEN others THEN
    requested_role := NULL;
  END;

  IF requested_role IN ('business_owner'::app_role, 'sponsor'::app_role, 'customer'::app_role, 'seller'::app_role) THEN
    safe_role := requested_role;
  ELSE
    safe_role := 'customer'::app_role;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, safe_role);

  RETURN new;
END;
$function$;
