UPDATE public.businesses SET latitude = 5.9359, longitude = -73.6201
WHERE city = 'Barbosa' AND (latitude IS NULL OR longitude IS NULL);

UPDATE public.businesses SET latitude = 5.9330, longitude = -73.6250
WHERE slug = 'el-diamante';