-- Add slug column to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Create function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(name text) RETURNS text AS $$
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
$$ LANGUAGE plpgsql IMMUTABLE;

-- Clear all existing businesses
TRUNCATE TABLE businesses CASCADE;

-- Insert real Cali businesses with proper slugs
INSERT INTO businesses (name, slug, category, neighborhood, description, address, price_range, latitude, longitude, owner_id, zone, featured) VALUES
('Juan Valdez Café', 'juan-valdez-cafe', 'Café', 'Granada', 'Café colombiano premium y pasteles artesanales', 'Carrera 100 #11-69, Granada', '$$', 3.4516, -76.5319, (SELECT id FROM auth.users LIMIT 1), 'Oeste', true),
('El Zaguán de San Antonio', 'el-zaguan-de-san-antonio', 'Restaurante', 'San Antonio', 'Restaurante de comida típica caleña en ambiente colonial', 'Carrera 10 #1-20, San Antonio', '$$$', 3.4505, -76.5372, (SELECT id FROM auth.users LIMIT 1), 'Centro', true),
('Carbón de Leña', 'carbon-de-lena', 'Restaurante', 'Decepaz', 'Especialistas en asados y carnes a la parrilla', 'Calle 52 #2-45, Decepaz', '$$', 3.4372, -76.5225, (SELECT id FROM auth.users LIMIT 1), 'Sur', true),
('Macondo', 'macondo', 'Restaurante', 'Granada', 'Cocina contemporánea colombiana', 'Avenida 4 Norte #6N-15, Granada', '$$$', 3.4542, -76.5315, (SELECT id FROM auth.users LIMIT 1), 'Norte', true),
('Ringlete', 'ringlete', 'Restaurante', 'Vallegrande', 'Comida típica del Valle del Cauca', 'Carrera 35 #5-67, Vallegrande', '$$', 3.3703, -76.5295, (SELECT id FROM auth.users LIMIT 1), 'Sur', false),
('Platillos Voladores', 'platillos-voladores', 'Restaurante', 'San Antonio', 'Comida fusión y cócteles creativos', 'Calle 3 Oeste #3-83, San Antonio', '$$$', 3.4485, -76.5361, (SELECT id FROM auth.users LIMIT 1), 'Centro', true),
('La Comitiva', 'la-comitiva', 'Café', 'El Peñón', 'Café specialty y brunch', 'Avenida 8N #14-46, El Peñón', '$$', 3.4628, -76.5298, (SELECT id FROM auth.users LIMIT 1), 'Norte', false);