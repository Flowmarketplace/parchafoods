ALTER TABLE public.business_subscriptions
  ADD CONSTRAINT business_subscriptions_business_id_fkey
  FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;