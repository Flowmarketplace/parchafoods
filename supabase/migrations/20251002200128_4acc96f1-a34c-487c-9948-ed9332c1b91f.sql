-- Add loyalty configuration to businesses table
ALTER TABLE public.businesses
ADD COLUMN loyalty_enabled boolean DEFAULT false,
ADD COLUMN loyalty_points_per_scan integer DEFAULT 1 CHECK (loyalty_points_per_scan > 0),
ADD COLUMN loyalty_points_to_redeem integer DEFAULT 10 CHECK (loyalty_points_to_redeem > 0),
ADD COLUMN loyalty_reward_image text,
ADD COLUMN loyalty_reward_description text;

COMMENT ON COLUMN public.businesses.loyalty_enabled IS 'Si el programa de lealtad está activo';
COMMENT ON COLUMN public.businesses.loyalty_points_per_scan IS 'Puntos que gana el cliente por cada escaneo/compra';
COMMENT ON COLUMN public.businesses.loyalty_points_to_redeem IS 'Puntos necesarios para canjear el premio';
COMMENT ON COLUMN public.businesses.loyalty_reward_image IS 'Imagen del premio que se entrega al completar los puntos';
COMMENT ON COLUMN public.businesses.loyalty_reward_description IS 'Descripción del premio';

-- Modify loyalty_points table to be per business
ALTER TABLE public.loyalty_points
DROP COLUMN IF EXISTS place_id CASCADE;

ALTER TABLE public.loyalty_points
ADD COLUMN business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE;

-- Create unique constraint per user per business
ALTER TABLE public.loyalty_points
DROP CONSTRAINT IF EXISTS loyalty_points_user_id_place_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS loyalty_points_user_business_unique 
ON public.loyalty_points(user_id, business_id);

-- Modify loyalty_history table
ALTER TABLE public.loyalty_history
DROP COLUMN IF EXISTS place_id CASCADE,
DROP COLUMN IF EXISTS qr_code CASCADE;

ALTER TABLE public.loyalty_history
ADD COLUMN business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE,
ADD COLUMN scan_type text DEFAULT 'purchase' CHECK (scan_type IN ('purchase', 'qr_scan', 'manual'));

-- Update RLS policies for loyalty_points to use business_id
DROP POLICY IF EXISTS "Users can view their own loyalty points" ON public.loyalty_points;
DROP POLICY IF EXISTS "Users can insert their own loyalty points" ON public.loyalty_points;
DROP POLICY IF EXISTS "Users can update their own loyalty points" ON public.loyalty_points;

CREATE POLICY "Users can view their own loyalty points"
ON public.loyalty_points
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own loyalty points"
ON public.loyalty_points
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loyalty points"
ON public.loyalty_points
FOR UPDATE
USING (auth.uid() = user_id);

-- Business owners can view loyalty points for their business
CREATE POLICY "Business owners can view their business loyalty points"
ON public.loyalty_points
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = loyalty_points.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Update RLS for loyalty_history
DROP POLICY IF EXISTS "Users can view their own loyalty history" ON public.loyalty_history;
DROP POLICY IF EXISTS "Users can insert their own loyalty history" ON public.loyalty_history;

CREATE POLICY "Users can view their own loyalty history"
ON public.loyalty_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own loyalty history"
ON public.loyalty_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Business owners can view loyalty history for their business
CREATE POLICY "Business owners can view their business loyalty history"
ON public.loyalty_history
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = loyalty_history.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_loyalty_points_business ON public.loyalty_points(business_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_history_business ON public.loyalty_history(business_id);