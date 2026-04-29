DELETE FROM business_hours WHERE business_id IN ('d3b3983a-3eae-463e-8df8-8cddba9938e8','7fe69252-996a-4d93-8861-5fea1fdfa600');
DELETE FROM business_images WHERE business_id IN ('d3b3983a-3eae-463e-8df8-8cddba9938e8','7fe69252-996a-4d93-8861-5fea1fdfa600');
DELETE FROM business_attributes WHERE business_id IN ('d3b3983a-3eae-463e-8df8-8cddba9938e8','7fe69252-996a-4d93-8861-5fea1fdfa600');
DELETE FROM business_menu WHERE business_id IN ('d3b3983a-3eae-463e-8df8-8cddba9938e8','7fe69252-996a-4d93-8861-5fea1fdfa600');
DELETE FROM business_promotions WHERE business_id IN ('d3b3983a-3eae-463e-8df8-8cddba9938e8','7fe69252-996a-4d93-8861-5fea1fdfa600');
DELETE FROM business_branches WHERE business_id IN ('d3b3983a-3eae-463e-8df8-8cddba9938e8','7fe69252-996a-4d93-8861-5fea1fdfa600');
DELETE FROM business_reviews WHERE business_id IN ('d3b3983a-3eae-463e-8df8-8cddba9938e8','7fe69252-996a-4d93-8861-5fea1fdfa600');
DELETE FROM business_shorts WHERE business_id IN ('d3b3983a-3eae-463e-8df8-8cddba9938e8','7fe69252-996a-4d93-8861-5fea1fdfa600');
DELETE FROM businesses WHERE id IN ('d3b3983a-3eae-463e-8df8-8cddba9938e8','7fe69252-996a-4d93-8861-5fea1fdfa600');

INSERT INTO businesses (owner_id, name, slug, category, description, address, neighborhood, zone, phone, whatsapp, website, latitude, longitude, price_range, featured)
VALUES
('1936cd3c-eb9b-4844-8c2c-3d1ecadf213a', 'Trattoria Italia da Tommaso', 'trattoria-italia-da-tommaso', 'Italiana',
 'Auténtica cocina italiana en Santa Mónica. Pastas, pizzas y platos tradicionales en un ambiente acogedor.',
 'Avenida 6 Bis Nte. #27N-56', 'Santa Mónica', 'Norte', '6023740003', '573023740003', NULL,
 3.4651, -76.5320, '$$', false),
('1936cd3c-eb9b-4844-8c2c-3d1ecadf213a', 'El Cilindro Municipal', 'el-cilindro-municipal', 'Comida Peruana',
 'Restaurante de cocina rústica peruana a la brasa. Reconocido por su pollo al cilindro y cortes especiales.',
 'Paseo Comercial Las Velas, Carrera 105 #15B-45', 'Ciudad Jardín', 'Sur', '3166775397', '573166775397', 'https://elcilindromunicipal.com.co',
 3.3712, -76.5320, '$$', true),
('1936cd3c-eb9b-4844-8c2c-3d1ecadf213a', 'Pura Casta', 'pura-casta', 'Carnes y Parrilla',
 'Restaurante caleño especializado en carnes a la parrilla y cortes selectos en un ambiente familiar.',
 'Av. La María #37', 'La María', 'Sur', '6024851234', NULL, NULL,
 3.4019, -76.5419, '$$', false),
('1936cd3c-eb9b-4844-8c2c-3d1ecadf213a', 'El Corte Gourmet', 'el-corte-gourmet', 'Carnes y Parrilla',
 'Carnicería gourmet y restaurante en Cali. Carnes nacionales e internacionales selladas al vacío para garantizar frescura y calidad.',
 'Cali, Valle del Cauca', 'Cali', 'Sur', NULL, NULL, 'https://elcortegourmet.com',
 3.4372, -76.5226, '$$$', false);