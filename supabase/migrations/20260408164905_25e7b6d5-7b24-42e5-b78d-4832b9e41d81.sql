UPDATE storage.buckets 
SET file_size_limit = 104857600,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/mpeg']
WHERE id = 'business-content';