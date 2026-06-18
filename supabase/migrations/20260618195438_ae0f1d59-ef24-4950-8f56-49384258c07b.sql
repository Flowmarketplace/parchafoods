
-- 1) business_ai_config: split owner ALL policy; hide api_key_encrypted column
DROP POLICY IF EXISTS "Business owners can manage their AI config" ON public.business_ai_config;

CREATE POLICY "Business owners can view their AI config"
ON public.business_ai_config FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_ai_config.business_id AND b.owner_id = auth.uid()));

CREATE POLICY "Business owners can insert their AI config"
ON public.business_ai_config FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_ai_config.business_id AND b.owner_id = auth.uid()));

CREATE POLICY "Business owners can update their AI config"
ON public.business_ai_config FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_ai_config.business_id AND b.owner_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_ai_config.business_id AND b.owner_id = auth.uid()));

CREATE POLICY "Business owners can delete their AI config"
ON public.business_ai_config FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_ai_config.business_id AND b.owner_id = auth.uid()));

REVOKE SELECT (api_key_encrypted) ON public.business_ai_config FROM anon, authenticated;

-- 2) businesses: hide owner_id and email from clients (phone/whatsapp remain public contact)
REVOKE SELECT (owner_id, email) ON public.businesses FROM anon, authenticated;

-- 3) proximity_notifications_sent: hide raw GPS from business owners
REVOKE SELECT (user_latitude, user_longitude) ON public.proximity_notifications_sent FROM anon, authenticated;

-- 4) business_subscriptions: hide payment_reference from clients
REVOKE SELECT (payment_reference) ON public.business_subscriptions FROM anon, authenticated;

-- 5) user_roles: scope admin policies to authenticated
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 6) Lock down SECURITY DEFINER helpers and trigger functions
REVOKE EXECUTE ON FUNCTION public.generate_referral_code() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_referral_code() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_review_rating() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.generate_slug(text) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.calculate_distance_km(numeric, numeric, numeric, numeric) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_nearby_businesses(numeric, numeric, numeric) FROM anon, PUBLIC;
-- get_nearby_businesses remains callable by authenticated clients
GRANT EXECUTE ON FUNCTION public.get_nearby_businesses(numeric, numeric, numeric) TO authenticated;
-- has_role must stay callable so RLS policies can evaluate it for both roles
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated;

-- 7) Public storage buckets: drop broad listing policies (public URLs still work)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Everyone can view business content" ON storage.objects;
DROP POLICY IF EXISTS "Public read shorts-videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view prospect logos" ON storage.objects;
DROP POLICY IF EXISTS "Sponsor assets are publicly viewable" ON storage.objects;
