
CREATE TABLE public.seller_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  business_id uuid REFERENCES public.businesses(id) ON DELETE SET NULL,
  subscription_id uuid REFERENCES public.business_subscriptions(id) ON DELETE SET NULL,
  client_name text,
  sale_type text NOT NULL DEFAULT 'venta',
  amount numeric NOT NULL DEFAULT 0,
  sale_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.seller_sales TO authenticated;
GRANT ALL ON public.seller_sales TO service_role;

ALTER TABLE public.seller_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers manage their own sales"
ON public.seller_sales FOR ALL TO authenticated
USING (public.is_seller_owner(seller_id) OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.is_seller_owner(seller_id) OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_seller_sales_updated_at
BEFORE UPDATE ON public.seller_sales
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX seller_sales_seller_date_idx ON public.seller_sales (seller_id, sale_date DESC);
