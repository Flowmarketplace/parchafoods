ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS city text NOT NULL DEFAULT 'Cali',
  ADD COLUMN IF NOT EXISTS business_type text NOT NULL DEFAULT 'Comida';

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS city text NOT NULL DEFAULT 'Cali';

UPDATE public.businesses SET city = 'Cali' WHERE city IS NULL OR city = '';
UPDATE public.businesses SET business_type = 'Comida' WHERE business_type IS NULL OR business_type = '';
UPDATE public.events SET city = 'Cali' WHERE city IS NULL OR city = '';

CREATE INDEX IF NOT EXISTS businesses_city_idx ON public.businesses (city);
CREATE INDEX IF NOT EXISTS businesses_business_type_idx ON public.businesses (business_type);
CREATE INDEX IF NOT EXISTS events_city_idx ON public.events (city);