DROP POLICY IF EXISTS "Business owners can upload their content" ON storage.objects;
DROP POLICY IF EXISTS "Business owners can update their content" ON storage.objects;
DROP POLICY IF EXISTS "Business owners can delete their content" ON storage.objects;

CREATE POLICY "Business owners can upload their content"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'business-content'
  AND (
    (storage.foldername(storage.objects.name))[1] = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.businesses AS owned_business
      WHERE owned_business.id::text = (storage.foldername(storage.objects.name))[1]
        AND owned_business.owner_id = auth.uid()
    )
  )
);

CREATE POLICY "Business owners can update their content"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'business-content'
  AND (
    (storage.foldername(storage.objects.name))[1] = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.businesses AS owned_business
      WHERE owned_business.id::text = (storage.foldername(storage.objects.name))[1]
        AND owned_business.owner_id = auth.uid()
    )
  )
)
WITH CHECK (
  bucket_id = 'business-content'
  AND (
    (storage.foldername(storage.objects.name))[1] = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.businesses AS owned_business
      WHERE owned_business.id::text = (storage.foldername(storage.objects.name))[1]
        AND owned_business.owner_id = auth.uid()
    )
  )
);

CREATE POLICY "Business owners can delete their content"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'business-content'
  AND (
    (storage.foldername(storage.objects.name))[1] = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.businesses AS owned_business
      WHERE owned_business.id::text = (storage.foldername(storage.objects.name))[1]
        AND owned_business.owner_id = auth.uid()
    )
  )
);