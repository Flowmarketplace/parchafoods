-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  organizer TEXT,
  price_range TEXT,
  ticket_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view events
CREATE POLICY "Everyone can view events"
  ON public.events
  FOR SELECT
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample events in Cali
INSERT INTO public.events (title, slug, description, category, location, address, latitude, longitude, start_date, end_date, image_url, organizer, price_range, featured)
VALUES 
  ('Feria de Cali 2025', 'feria-de-cali-2025', 'La feria más importante del Valle del Cauca con desfiles, conciertos y actividades culturales', 'Festival', 'Cali Centro', 'Avenida Roosevelt, Cali', 3.4372, -76.5225, '2025-12-25 00:00:00+00', '2025-12-30 23:59:59+00', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3', 'Alcaldía de Cali', 'Gratis', true),
  
  ('Concierto Salsa al Parque', 'concierto-salsa-parque', 'Concierto gratuito de orquestas de salsa en el Parque de la Música', 'Música', 'Parque de la Música', 'Carrera 1 con Calle 8, Cali', 3.4525, -76.5322, '2025-11-15 18:00:00+00', '2025-11-15 23:00:00+00', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae', 'Secretaría de Cultura', 'Gratis', true),
  
  ('Festival de Teatro Cali', 'festival-teatro-cali', 'Obras de teatro nacional e internacional en diferentes espacios culturales', 'Teatro', 'Varios teatros', 'Centro de Cali', 3.4372, -76.5225, '2025-10-20 00:00:00+00', '2025-10-27 23:59:59+00', 'https://images.unsplash.com/photo-1503095396549-807759245b35', 'Teatro Municipal', '$$', false),
  
  ('Mercado Cultural Granada', 'mercado-cultural-granada', 'Artesanías, comida local y música en vivo todos los domingos', 'Mercado', 'Granada', 'Parque de Granada', 3.4516, -76.5319, '2025-10-20 10:00:00+00', '2025-10-20 16:00:00+00', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', 'Comunidad Granada', '$', false),
  
  ('Maratón de Cali', 'maraton-cali', 'Carrera atlética de 42km recorriendo los principales puntos de la ciudad', 'Deportes', 'Cali', 'Salida: Estadio Olímpico Pascual Guerrero', 3.4372, -76.5425, '2025-11-10 06:00:00+00', '2025-11-10 12:00:00+00', 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3', 'Club de Atletismo Cali', '$$', true),
  
  ('Noche de Museos', 'noche-museos', 'Museos abiertos hasta medianoche con actividades especiales', 'Cultural', 'Centro Histórico', 'Varios museos del centro', 3.4372, -76.5225, '2025-10-25 18:00:00+00', '2025-10-26 00:00:00+00', 'https://images.unsplash.com/photo-1554907984-15263bfd63bd', 'Red de Museos', 'Gratis', false),
  
  ('Festival Petronio Álvarez', 'festival-petronio-alvarez', 'Festival de música del Pacífico colombiano', 'Música', 'Unidad Deportiva Alberto Galindo', 'Calle 34 con Carrera 3', 3.4252, -76.5319, '2025-08-15 00:00:00+00', '2025-08-19 23:59:59+00', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4', 'Secretaría de Cultura', '$', true);