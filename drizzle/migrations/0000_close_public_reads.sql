DROP POLICY IF EXISTS "Public read clients" ON public.clients;
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public read seller_sales" ON public.seller_sales;
DROP POLICY IF EXISTS "Public read business_subscriptions" ON public.business_subscriptions;
REVOKE SELECT ON public.clients, public.profiles, public.seller_sales, public.business_subscriptions FROM anon;
DROP POLICY IF EXISTS "Everyone can view sponsor plans" ON public.sponsor_plans;
CREATE POLICY "Everyone can view active sponsor plans" ON public.sponsor_plans FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Everyone can view subscription plans" ON public.subscription_plans;
CREATE POLICY "Signed-in users can view subscription plans" ON public.subscription_plans FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);