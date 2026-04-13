
ALTER TABLE public.prospects
ADD COLUMN first_contact_date date DEFAULT NULL,
ADD COLUMN contacted_by text DEFAULT NULL;

CREATE TABLE public.prospect_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  appointment_date date NOT NULL,
  appointment_time time,
  contacted_by text,
  status text NOT NULL DEFAULT 'programada',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.prospect_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all prospect appointments"
ON public.prospect_appointments FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_prospect_appointments_updated_at
BEFORE UPDATE ON public.prospect_appointments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
