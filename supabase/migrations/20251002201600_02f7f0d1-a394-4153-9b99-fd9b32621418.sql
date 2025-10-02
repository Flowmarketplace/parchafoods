-- Fix security warnings by setting search_path on functions

-- Recreate calculate_distance_km with search_path
DROP FUNCTION IF EXISTS public.calculate_distance_km(NUMERIC, NUMERIC, NUMERIC, NUMERIC);

CREATE OR REPLACE FUNCTION public.calculate_distance_km(
  lat1 NUMERIC,
  lon1 NUMERIC,
  lat2 NUMERIC,
  lon2 NUMERIC
)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  earth_radius_km CONSTANT NUMERIC := 6371;
  dlat NUMERIC;
  dlon NUMERIC;
  a NUMERIC;
  c NUMERIC;
BEGIN
  -- Convert degrees to radians
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  
  -- Haversine formula
  a := sin(dlat/2) * sin(dlat/2) + 
       cos(radians(lat1)) * cos(radians(lat2)) * 
       sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN earth_radius_km * c;
END;
$$;

-- Recreate get_nearby_businesses with search_path
DROP FUNCTION IF EXISTS public.get_nearby_businesses(NUMERIC, NUMERIC, NUMERIC);

CREATE OR REPLACE FUNCTION public.get_nearby_businesses(
  user_lat NUMERIC,
  user_lon NUMERIC,
  max_radius_km NUMERIC DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  distance_km NUMERIC,
  notification_radius_km NUMERIC
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.latitude,
    b.longitude,
    public.calculate_distance_km(user_lat, user_lon, b.latitude, b.longitude) as distance_km,
    b.notification_radius_km
  FROM public.businesses b
  WHERE 
    b.geo_notifications_enabled = true
    AND b.latitude IS NOT NULL
    AND b.longitude IS NOT NULL
    AND public.calculate_distance_km(user_lat, user_lon, b.latitude, b.longitude) <= LEAST(b.notification_radius_km, max_radius_km)
  ORDER BY distance_km ASC;
END;
$$;