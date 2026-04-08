
INSERT INTO storage.buckets (id, name, public) VALUES ('shorts-videos', 'shorts-videos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read shorts-videos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'shorts-videos');
CREATE POLICY "Auth upload shorts-videos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'shorts-videos');
