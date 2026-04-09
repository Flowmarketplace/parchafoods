
-- Table to track route check-ins
CREATE TABLE public.route_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  route_category TEXT NOT NULL,
  receipt_image_url TEXT,
  qr_scanned BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  goals_earned INTEGER DEFAULT 1,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, business_id, route_category)
);

-- Enable RLS
ALTER TABLE public.route_visits ENABLE ROW LEVEL SECURITY;

-- Users can view their own visits
CREATE POLICY "Users can view their own route visits"
ON public.route_visits FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own visits
CREATE POLICY "Users can insert their own route visits"
ON public.route_visits FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins can manage all visits
CREATE POLICY "Admins can manage route visits"
ON public.route_visits FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Everyone can view visit counts (for displaying on route cards)
CREATE POLICY "Anyone can view route visit counts"
ON public.route_visits FOR SELECT
USING (true);
