
-- Fix shorts-videos INSERT policy (broken ownership check)
DROP POLICY IF EXISTS "Owners or admins upload shorts-videos" ON storage.objects;
CREATE POLICY "Owners or admins upload shorts-videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'shorts-videos'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.owner_id = auth.uid()
        AND (storage.foldername(objects.name))[1] = (b.id)::text
    )
  )
);

-- Restrict prospect-logos uploads to admins
DROP POLICY IF EXISTS "Authenticated users can upload prospect logos" ON storage.objects;
CREATE POLICY "Admins can upload prospect logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'prospect-logos'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Restrict sponsor-assets uploads to sponsor owners or admins
DROP POLICY IF EXISTS "Authenticated can upload sponsor assets" ON storage.objects;
CREATE POLICY "Sponsor owners or admins upload sponsor assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'sponsor-assets'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.sponsors s
      WHERE s.user_id = auth.uid()
        AND (
          objects.name LIKE (s.id::text || '/%')
          OR objects.name LIKE ('logos/' || s.id::text || '-%')
        )
    )
  )
);

-- Add admin management policy on business_ai_config
CREATE POLICY "Admins can manage all business AI configs"
ON public.business_ai_config FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
