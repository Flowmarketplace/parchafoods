CREATE POLICY "Sellers create their subscriptions"
ON public.business_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (seller_id IS NOT NULL AND public.is_seller_owner(seller_id));

INSERT INTO public.business_subscriptions (business_id, plan_id, seller_id, status, start_date, end_date, custom_price, commission_percentage, collected, auto_renew)
SELECT 'eff07966-3f39-41d6-9b87-81245e3d848a', p.id, 'dd72b9e9-9abe-4eb8-9707-ef61df4f6965', 'active', '2026-09-16T12:00:00Z', '2026-10-16T12:00:00Z', 100000, 25, false, true
FROM public.subscription_plans p
WHERE p.price = 100000
AND NOT EXISTS (SELECT 1 FROM public.business_subscriptions s WHERE s.business_id = 'eff07966-3f39-41d6-9b87-81245e3d848a')
LIMIT 1;