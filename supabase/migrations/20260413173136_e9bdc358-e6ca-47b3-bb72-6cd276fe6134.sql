
INSERT INTO storage.buckets (id, name, public) VALUES ('prospect-logos', 'prospect-logos', true);

CREATE POLICY "Authenticated users can upload prospect logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'prospect-logos');

CREATE POLICY "Authenticated users can update prospect logos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'prospect-logos');

CREATE POLICY "Authenticated users can delete prospect logos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'prospect-logos');

CREATE POLICY "Anyone can view prospect logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'prospect-logos');
