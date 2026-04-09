
-- Admin can INSERT businesses
CREATE POLICY "Admins can insert businesses"
ON public.businesses FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin can UPDATE any business
CREATE POLICY "Admins can update any business"
ON public.businesses FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can DELETE any business
CREATE POLICY "Admins can delete businesses"
ON public.businesses FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can manage all business_images
CREATE POLICY "Admins can manage business images"
ON public.business_images FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin can manage all business_menu
CREATE POLICY "Admins can manage business menu"
ON public.business_menu FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin can manage all business_shorts
CREATE POLICY "Admins can manage business shorts"
ON public.business_shorts FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
