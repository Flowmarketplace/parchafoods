-- Create businesses table to store business information
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  zone TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  price_range TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create business_images table for multiple images
CREATE TABLE public.business_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create business_menu table for restaurant menus
CREATE TABLE public.business_menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create business_attributes table for features
CREATE TABLE public.business_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  attribute_type TEXT NOT NULL, -- 'food_type', 'amenity', 'feature'
  attribute_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(business_id, attribute_type, attribute_value)
);

-- Create business_hours table for operating hours
CREATE TABLE public.business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(business_id, day_of_week)
);

-- Create business_promotions table
CREATE TABLE public.business_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  conditions TEXT,
  valid_until DATE,
  qr_code TEXT,
  first_time_only BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create business_shorts table for video content
CREATE TABLE public.business_shorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_shorts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for businesses table
CREATE POLICY "Business owners can view their own businesses"
  ON public.businesses FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Business owners can insert their own businesses"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Business owners can update their own businesses"
  ON public.businesses FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Everyone can view active businesses"
  ON public.businesses FOR SELECT
  USING (true);

-- RLS Policies for business_images
CREATE POLICY "Business owners can manage their business images"
  ON public.business_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = business_images.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Everyone can view business images"
  ON public.business_images FOR SELECT
  USING (true);

-- RLS Policies for business_menu
CREATE POLICY "Business owners can manage their menu"
  ON public.business_menu FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = business_menu.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Everyone can view menus"
  ON public.business_menu FOR SELECT
  USING (available = true);

-- RLS Policies for business_attributes
CREATE POLICY "Business owners can manage their attributes"
  ON public.business_attributes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = business_attributes.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Everyone can view business attributes"
  ON public.business_attributes FOR SELECT
  USING (true);

-- RLS Policies for business_hours
CREATE POLICY "Business owners can manage their hours"
  ON public.business_hours FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = business_hours.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Everyone can view business hours"
  ON public.business_hours FOR SELECT
  USING (true);

-- RLS Policies for business_promotions
CREATE POLICY "Business owners can manage their promotions"
  ON public.business_promotions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = business_promotions.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Everyone can view active promotions"
  ON public.business_promotions FOR SELECT
  USING (active = true);

-- RLS Policies for business_shorts
CREATE POLICY "Business owners can manage their shorts"
  ON public.business_shorts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = business_shorts.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Everyone can view active shorts"
  ON public.business_shorts FOR SELECT
  USING (active = true);

-- Create storage bucket for business content
INSERT INTO storage.buckets (id, name, public) 
VALUES ('business-content', 'business-content', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for business content
CREATE POLICY "Business owners can upload their content"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'business-content' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Business owners can update their content"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'business-content' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Business owners can delete their content"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'business-content' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Everyone can view business content"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-content');

-- Add trigger for updated_at
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();