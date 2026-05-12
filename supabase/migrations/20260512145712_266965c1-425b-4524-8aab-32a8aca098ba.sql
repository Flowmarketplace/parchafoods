
-- 1) Restrict permissive INSERT on proximity_notifications_sent
DROP POLICY IF EXISTS "System can insert proximity notifications" ON public.proximity_notifications_sent;
CREATE POLICY "Users can insert their own proximity notifications"
ON public.proximity_notifications_sent
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 2) Lock down EXECUTE on SECURITY DEFINER functions
-- Trigger-only functions: revoke from everyone (triggers run as table owner)
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_referral_code() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.validate_review_rating() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.generate_referral_code() FROM PUBLIC, anon, authenticated;

-- Helper used by RLS policies: only authenticated needs EXECUTE
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Distance helper used inside another SECURITY DEFINER fn; not for direct API use
REVOKE ALL ON FUNCTION public.calculate_distance_km(numeric, numeric, numeric, numeric) FROM PUBLIC, anon, authenticated;

-- Nearby businesses: only signed-in users
REVOKE ALL ON FUNCTION public.get_nearby_businesses(numeric, numeric, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_nearby_businesses(numeric, numeric, numeric) TO authenticated;

-- Slug generator: not security-sensitive but no need to expose
REVOKE ALL ON FUNCTION public.generate_slug(text) FROM PUBLIC, anon, authenticated;
