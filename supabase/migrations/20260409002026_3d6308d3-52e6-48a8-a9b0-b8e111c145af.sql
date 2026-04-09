
-- Admin can manage all business_promotions
CREATE POLICY "Admins can manage business promotions"
ON public.business_promotions FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin can manage all business_attributes
CREATE POLICY "Admins can manage business attributes"
ON public.business_attributes FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
