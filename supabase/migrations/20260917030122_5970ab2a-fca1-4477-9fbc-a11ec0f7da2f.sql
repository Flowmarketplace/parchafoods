DROP POLICY IF EXISTS "Authenticated users can upload business content" ON storage.objects;
DROP POLICY IF EXISTS "Business owners can update their content" ON storage.objects;
DROP POLICY IF EXISTS "Business owners can delete their content" ON storage.objects;

CREATE POLICY "Business owners can upload their content"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-content'
  AND EXISTS (
    SELECT 1
    FROM public.businesses b
    WHERE b.id::text = (storage.foldername(name))[1]
      AND b.owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can update their content"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'business-content'
  AND EXISTS (
    SELECT 1
    FROM public.businesses b
    WHERE b.id::text = (storage.foldername(name))[1]
      AND b.owner_id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'business-content'
  AND EXISTS (
    SELECT 1
    FROM public.businesses b
    WHERE b.id::text = (storage.foldername(name))[1]
      AND b.owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can delete their content"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-content'
  AND EXISTS (
    SELECT 1
    FROM public.businesses b
    WHERE b.id::text = (storage.foldername(name))[1]
      AND b.owner_id = auth.uid()
  )
);