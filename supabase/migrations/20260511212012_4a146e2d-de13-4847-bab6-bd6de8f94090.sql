-- 1. Fix overly-permissive notifications insert policy
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "Users can insert their own notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 2. Harden handle_new_user: never trust client-provided role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );

  -- Always assign default 'customer' role. Elevated roles must be granted by an admin.
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'customer'::app_role);

  RETURN new;
END;
$function$;

-- 3. Fix mutable search_path on generate_slug
CREATE OR REPLACE FUNCTION public.generate_slug(name text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN lower(regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(name, '[áàäâ]', 'a', 'gi'),
          '[éèëê]', 'e', 'gi'
        ),
        '[íìïî]', 'i', 'gi'
      ),
      '[óòöô]', 'o', 'gi'
    ),
    '[^a-z0-9]+', '-', 'gi'
  ));
END;
$function$;