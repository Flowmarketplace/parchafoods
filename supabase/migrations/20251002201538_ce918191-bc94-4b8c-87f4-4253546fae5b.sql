-- Add geolocation and notification settings to businesses table
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS geo_notifications_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_radius_km NUMERIC(5,2) DEFAULT 1.0 CHECK (notification_radius_km > 0 AND notification_radius_km <= 50);

-- Add tracking for sent proximity notifications to avoid spam
CREATE TABLE IF NOT EXISTS public.proximity_notifications_sent (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_latitude NUMERIC(10,8),
  user_longitude NUMERIC(11,8),
  distance_km NUMERIC(6,3)
);

-- Enable RLS
ALTER TABLE public.proximity_notifications_sent ENABLE ROW LEVEL SECURITY;

-- RLS Policies for proximity_notifications_sent
CREATE POLICY "Users can view their own proximity notifications"
ON public.proximity_notifications_sent
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert proximity notifications"
ON public.proximity_notifications_sent
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Business owners can view their proximity notifications"
ON public.proximity_notifications_sent
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = proximity_notifications_sent.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_proximity_notifications_user ON public.proximity_notifications_sent(user_id);
CREATE INDEX IF NOT EXISTS idx_proximity_notifications_business ON public.proximity_notifications_sent(business_id);
CREATE INDEX IF NOT EXISTS idx_proximity_notifications_sent_at ON public.proximity_notifications_sent(sent_at);
CREATE INDEX IF NOT EXISTS idx_businesses_geo ON public.businesses(latitude, longitude) WHERE geo_notifications_enabled = true;

-- Create function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION public.calculate_distance_km(
  lat1 NUMERIC,
  lon1 NUMERIC,
  lat2 NUMERIC,
  lon2 NUMERIC
)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
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

-- Create function to get nearby businesses for a user location
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