-- Update the app_role enum to include business_owner and customer roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'business_owner';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'customer';

-- Update the handle_new_user function to assign role based on user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role app_role;
BEGIN
  -- Create profile for new user
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  
  -- Determine role from metadata, default to 'customer'
  user_role := COALESCE(
    (new.raw_user_meta_data->>'role')::app_role,
    'customer'::app_role
  );
  
  -- Assign role to user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, user_role);
  
  RETURN new;
END;
$function$;