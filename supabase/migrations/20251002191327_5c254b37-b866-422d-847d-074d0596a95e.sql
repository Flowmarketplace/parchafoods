-- Create trigger function to handle new user roles
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert role from user metadata into user_roles table
  IF NEW.raw_user_meta_data->>'role' = 'business_owner' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'business_owner'::app_role);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically assign roles on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();