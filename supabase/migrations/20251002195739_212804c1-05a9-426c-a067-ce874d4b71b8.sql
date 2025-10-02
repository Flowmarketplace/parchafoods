-- Add max_redemptions_per_user column to business_promotions
ALTER TABLE public.business_promotions
ADD COLUMN max_redemptions_per_user integer DEFAULT 1 CHECK (max_redemptions_per_user > 0);

COMMENT ON COLUMN public.business_promotions.max_redemptions_per_user IS 'Número máximo de veces que un usuario puede canjear esta promoción';

-- Create table to track redemptions
CREATE TABLE IF NOT EXISTS public.promotion_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid NOT NULL REFERENCES public.business_promotions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  redeemed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(promotion_id, user_id, redeemed_at)
);

-- Enable RLS
ALTER TABLE public.promotion_redemptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own redemptions
CREATE POLICY "Users can view their own redemptions"
ON public.promotion_redemptions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own redemptions
CREATE POLICY "Users can insert their own redemptions"
ON public.promotion_redemptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Business owners can view redemptions for their promotions
CREATE POLICY "Business owners can view promotion redemptions"
ON public.promotion_redemptions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.business_promotions bp
    JOIN public.businesses b ON b.id = bp.business_id
    WHERE bp.id = promotion_redemptions.promotion_id
    AND b.owner_id = auth.uid()
  )
);

-- Create index for faster lookups
CREATE INDEX idx_promotion_redemptions_user_promo 
ON public.promotion_redemptions(promotion_id, user_id);

CREATE INDEX idx_promotion_redemptions_date 
ON public.promotion_redemptions(redeemed_at DESC);