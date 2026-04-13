
ALTER TABLE public.prospect_appointments
ADD COLUMN client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
ALTER COLUMN prospect_id DROP NOT NULL;
