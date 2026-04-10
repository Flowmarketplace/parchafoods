
-- Allow admins to manage all business hours
CREATE POLICY "Admins can manage all business hours"
ON public.business_hours
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
