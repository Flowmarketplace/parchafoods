-- Fix search_path for generate_referral_code function
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    -- Generate 8 character alphanumeric code
    code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists;
    
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Fix search_path for set_referral_code function
CREATE OR REPLACE FUNCTION public.set_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := public.generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$;