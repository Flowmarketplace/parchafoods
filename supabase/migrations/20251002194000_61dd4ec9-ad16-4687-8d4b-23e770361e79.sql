-- Add image_type column to business_images table
ALTER TABLE public.business_images
ADD COLUMN image_type text NOT NULL DEFAULT 'gallery'
CHECK (image_type IN ('profile', 'menu', 'promotion', 'gallery', 'other'));

-- Add comment to explain the column
COMMENT ON COLUMN public.business_images.image_type IS 'Type of image: profile (foto de perfil), menu (fotos del menú), promotion (fotos de promociones), gallery (galería general), other (otras)';