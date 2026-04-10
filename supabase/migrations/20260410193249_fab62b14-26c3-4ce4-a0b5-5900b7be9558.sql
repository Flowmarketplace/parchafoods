
-- Create business_branches table for multiple locations
CREATE TABLE public.business_branches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  phone TEXT,
  whatsapp TEXT,
  is_main BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_branches ENABLE ROW LEVEL SECURITY;

-- Everyone can view active branches
CREATE POLICY "Everyone can view active branches"
ON public.business_branches
FOR SELECT
USING (active = true);

-- Business owners can manage their branches
CREATE POLICY "Business owners can manage their branches"
ON public.business_branches
FOR ALL
USING (EXISTS (
  SELECT 1 FROM businesses
  WHERE businesses.id = business_branches.business_id
  AND businesses.owner_id = auth.uid()
));

-- Admins can manage all branches
CREATE POLICY "Admins can manage all branches"
ON public.business_branches
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Index for fast lookups
CREATE INDEX idx_business_branches_business_id ON public.business_branches(business_id);
