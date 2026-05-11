CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  requested_role app_role;
  safe_role app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );

  BEGIN
    requested_role := (new.raw_user_meta_data->>'role')::app_role;
  EXCEPTION WHEN others THEN
    requested_role := NULL;
  END;

  -- Never honor a self-assigned admin role. Only allow safe self-service roles.
  IF requested_role IN ('business_owner'::app_role, 'sponsor'::app_role, 'customer'::app_role) THEN
    safe_role := requested_role;
  ELSE
    safe_role := 'customer'::app_role;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, safe_role);

  RETURN new;
END;
$function$;