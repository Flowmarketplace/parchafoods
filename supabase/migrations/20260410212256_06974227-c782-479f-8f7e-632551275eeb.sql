CREATE TABLE public.prospects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  contact_person TEXT,
  next_contact_date DATE,
  contact_type TEXT DEFAULT 'llamada',
  status TEXT NOT NULL DEFAULT 'nuevo',
  observation TEXT,
  notes TEXT,
  category TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all prospects"
ON public.prospects
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_prospects_updated_at
BEFORE UPDATE ON public.prospects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();