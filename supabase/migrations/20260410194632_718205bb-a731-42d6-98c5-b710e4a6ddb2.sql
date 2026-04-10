
-- Add social media columns to businesses table
ALTER TABLE public.businesses
ADD COLUMN instagram_url TEXT,
ADD COLUMN facebook_url TEXT,
ADD COLUMN tiktok_url TEXT;
