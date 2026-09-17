DROP POLICY IF EXISTS "Business owners can upload their content" ON storage.objects;
DROP POLICY IF EXISTS "Business owners can update their content" ON storage.objects;
DROP POLICY IF EXISTS "Business owners can delete their content" ON storage.objects;

CREATE POLICY "Authenticated users can upload business content"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'business-content');

CREATE POLICY "Business owners can update their content"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'business-content'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'business-content'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Business owners can delete their content"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-content'
  AND (storage.foldername(name))[1] = auth.uid()::text
);