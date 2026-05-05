
-- Fix El Corral Granada: real address is Av. 4 Nte. #7N-46 Local 312-313
UPDATE businesses 
SET address = 'Av. 4 Nte. #7N-46 Local 312-313', 
    latitude = 3.4580, 
    longitude = -76.5290
WHERE name = 'El Corral Granada';

-- Fix Chacalacas: it's in Jardín Plaza, not Granada
UPDATE businesses 
SET address = 'CC Jardín Plaza, Calle 25', 
    neighborhood = 'Ciudad Jardín',
    latitude = 3.3660, 
    longitude = -76.5320
WHERE name = 'Chacalacas';

-- Fix Tony Roma's: real address is Avenida Colombia #1-40, El Peñón
UPDATE businesses 
SET address = 'Avenida Colombia #1-40', 
    neighborhood = 'El Peñón',
    latitude = 3.4500, 
    longitude = -76.5440
WHERE name = 'Tony Roma''s Cali';

-- Fix Sandwich Qbano Granada: real address
UPDATE businesses 
SET address = 'Avenida 6 con Calle 12N esquina',
    latitude = 3.4570,
    longitude = -76.5330
WHERE name = 'Sandwich Qbano Granada';

-- Fix La Boquería Asados: real address is Av. Cañasgordas
UPDATE businesses 
SET address = 'Av. Cañasgordas, vía Pance',
    neighborhood = 'Pance',
    latitude = 3.3580, 
    longitude = -76.5630
WHERE name = 'La Boquería Asados';

-- Fix Pampa Malbec: real address is Cra 105 #5B-46 CC Las Velas, Ciudad Jardín
UPDATE businesses 
SET address = 'Cra 105 #5B-46, CC Las Velas', 
    neighborhood = 'Ciudad Jardín',
    latitude = 3.3710, 
    longitude = -76.5320
WHERE name = 'Pampa Malbec';

-- Fix Palomulata: real address is Calle 38N #4BN-09
UPDATE businesses 
SET address = 'Calle 38N #4BN-09',
    neighborhood = 'Juanambú',
    latitude = 3.4660,
    longitude = -76.5290
WHERE name = 'Palomulata Parrilla Boutique';

-- Fix DeLulus: real address is Cra 56 #9-23
UPDATE businesses 
SET address = 'Cra 56 #9-23', 
    neighborhood = 'Panamericano',
    latitude = 3.4050, 
    longitude = -76.5400
WHERE name = 'DeLulus Cali';

-- Fix El gringo neighborhood typo
UPDATE businesses 
SET neighborhood = 'San Fernando'
WHERE name = 'El gringo american kitchen';

-- Fix Chihuahua Hot Dog: clean unicode characters
UPDATE businesses 
SET address = 'Parque del Perro, Cl. 3 Oeste #34-46'
WHERE name = 'Chihuahua Hot Dog';

-- Fix Tanoshii: correct address format
UPDATE businesses 
SET address = 'Av. 8 Norte #10-18'
WHERE name = 'Tanoshii Lounge & Sushi Bar';
