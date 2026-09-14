-- Add support for multiple time ranges per day
ALTER TABLE public.business_hours ADD COLUMN IF NOT EXISTS time_ranges JSONB DEFAULT '[]'::jsonb;

-- Ensure one row per business/day (keeps existing unique constraint or recreates it)
ALTER TABLE public.business_hours DROP CONSTRAINT IF EXISTS business_hours_business_id_day_of_week_key;
ALTER TABLE public.business_hours ADD CONSTRAINT business_hours_business_id_day_of_week_key UNIQUE (business_id, day_of_week);

-- Migrate existing single-range rows into the new JSON array format
UPDATE public.business_hours
SET time_ranges = jsonb_build_array(
  jsonb_build_object('open_time', open_time, 'close_time', close_time)
)
WHERE time_ranges = '[]'::jsonb
  AND open_time IS NOT NULL
  AND close_time IS NOT NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_hours TO authenticated;
GRANT ALL ON public.business_hours TO service_role;