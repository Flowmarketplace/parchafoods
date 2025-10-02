-- Create loyalty_points table to track points per user per place
CREATE TABLE public.loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  place_id TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  last_scan_at TIMESTAMP WITH TIME ZONE,
  reward_claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, place_id)
);

-- Create loyalty_history table to track individual scans
CREATE TABLE public.loyalty_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  place_id TEXT NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 1,
  qr_code TEXT NOT NULL,
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for loyalty_points
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

-- RLS Policies for loyalty_history
CREATE POLICY "Users can view their own loyalty history"
ON public.loyalty_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own loyalty history"
ON public.loyalty_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Trigger for automatic timestamp updates on loyalty_points
CREATE TRIGGER update_loyalty_points_updated_at
BEFORE UPDATE ON public.loyalty_points
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_loyalty_points_user_place ON public.loyalty_points(user_id, place_id);
CREATE INDEX idx_loyalty_history_user ON public.loyalty_history(user_id);
CREATE INDEX idx_loyalty_history_place ON public.loyalty_history(place_id);