-- Add description column to business_images for gallery images
ALTER TABLE public.business_images
ADD COLUMN description text;