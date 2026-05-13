
-- 1) Remove public SELECT on route_visits (exposes user_id, receipts)
DROP POLICY IF EXISTS "Anyone can view route visit counts" ON public.route_visits;

-- 2) Restrict shorts-videos uploads to admins or business owners of the target folder
DROP POLICY IF EXISTS "Auth upload shorts-videos" ON storage.objects;
CREATE POLICY "Owners or admins upload shorts-videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'shorts-videos'
  AND (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.owner_id = auth.uid()
        AND (storage.foldername(name))[1] = b.id::text
    )
  )
);

-- 3) Restrict sponsor-assets UPDATE/DELETE to the owning sponsor or admins
DROP POLICY IF EXISTS "Authenticated can update sponsor assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete sponsor assets" ON storage.objects;

CREATE POLICY "Sponsor owners or admins update sponsor assets"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'sponsor-assets'
  AND (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.sponsors s
      WHERE s.user_id = auth.uid()
        AND (
          name LIKE s.id::text || '/%'
          OR name LIKE 'logos/' || s.id::text || '-%'
        )
    )
  )
);

CREATE POLICY "Sponsor owners or admins delete sponsor assets"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'sponsor-assets'
  AND (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.sponsors s
      WHERE s.user_id = auth.uid()
        AND (
          name LIKE s.id::text || '/%'
          OR name LIKE 'logos/' || s.id::text || '-%'
        )
    )
  )
);

-- 4) Restrict prospect-logos UPDATE/DELETE to admins only
DROP POLICY IF EXISTS "Authenticated users can update prospect logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete prospect logos" ON storage.objects;

CREATE POLICY "Admins update prospect logos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'prospect-logos' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete prospect logos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'prospect-logos' AND public.has_role(auth.uid(), 'admin'::app_role));
