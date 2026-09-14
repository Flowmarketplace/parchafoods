-- Recreate signup trigger so new accounts get their profile and role
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill missing profiles
INSERT INTO public.profiles (id, full_name)
SELECT u.id, COALESCE(u.raw_user_meta_data->>'full_name','')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- Backfill missing roles (never admin)
INSERT INTO public.user_roles (user_id, role)
SELECT u.id,
  CASE WHEN u.raw_user_meta_data->>'role' IN ('business_owner','sponsor','customer')
       THEN (u.raw_user_meta_data->>'role')::app_role
       ELSE 'customer'::app_role END
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE r.user_id IS NULL;

-- Link the dental clinic to its owner account
UPDATE public.businesses
SET owner_id = '46de58d4-fb5a-46a5-a5bf-9c3bff5f823a'
WHERE id = 'f051b8a6-a626-4caa-a424-772eebe39e9b';