GRANT SELECT ON public.clients TO anon;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.seller_sales TO anon;
GRANT SELECT ON public.business_subscriptions TO anon;

DROP POLICY IF EXISTS "Public read clients" ON public.clients;
CREATE POLICY "Public read clients" ON public.clients FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public read seller_sales" ON public.seller_sales;
CREATE POLICY "Public read seller_sales" ON public.seller_sales FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public read business_subscriptions" ON public.business_subscriptions;
CREATE POLICY "Public read business_subscriptions" ON public.business_subscriptions FOR SELECT TO anon USING (true);