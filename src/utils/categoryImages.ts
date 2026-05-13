// High-quality Unsplash fallback images. We keep two layers:
// 1) RESTAURANT_IMAGE_OVERRIDES — explicit, hand-picked photo per business id.
//    These take priority and guarantee that each restaurant in the listing
//    grid gets a unique, contextually relevant image.
// 2) CATEGORY_FALLBACK_POOLS — per-category pools used only when a business
//    has no override and no uploaded photo.

const PARAMS = '?w=1600&q=85&auto=format&fit=crop';
const img = (id: string) => `https://images.unsplash.com/${id}${PARAMS}`;
const pool = (ids: string[]) => ids.map(img);

// ---------------------------------------------------------------------------
// 1) Per-restaurant overrides (business.id -> Unsplash photo id).
// Each photo is unique across the map and chosen to match the restaurant's
// concept (parrilla, sushi, mariscos, café, rooftop, etc.).
// ---------------------------------------------------------------------------
const OVERRIDES_RAW: Record<string, string> = {
  // Cervecerías / Bares
  'f4fe2d5a-c591-42a2-abde-ca019d42180c': 'photo-1535958636474-b021ee887b13', // 3 Cordilleras Cali
  '997f208f-5d6a-4fa2-adb0-75a8572976fb': 'photo-1546726747-421c6d69c929', // BBC Granada
  '8a8c7fc8-b744-4eb6-8a28-511625e51173': 'photo-1571767454098-246b94fbcf38', // Cilindro Municipal
  '07ff1fbe-3160-4b09-ab49-124ae6bfeeb7': 'photo-1577905394164-d566267e7c46', // Malta Cervecería
  'b8d67412-dc58-4b9d-bb8c-966cc7a0d24f': 'photo-1518176258769-f227c798150e', // La Topa Tolondra

  // Mexicana
  '317b130e-d8d8-4252-ba3d-da3feb7e78b5': 'photo-1599974579688-8dbdd335c77f', // Agave Azul
  'e2cfbd1e-0f78-49af-a99a-f2341f403c6d': 'photo-1565299624946-b28f40a0ae38', // El Mariachi
  '45d9b556-d995-4374-a79a-846bd0665639': 'photo-1604467794349-0b74285de7e7', // Frida Cocina Mexicana
  'b4efc69d-869d-46cd-b44e-d7e857632096': 'photo-1613514785940-daed07799d9b', // La Casa del Taco
  'b098c328-762f-4d0b-ab2f-f8ba6fef99f4': 'photo-1606761568499-6d2451b23c66', // Tacos & Tequila

  // Parrilla / Asados
  '214948a3-3b43-4f9c-a85e-06d6feefee36': 'photo-1558030006-450675393462', // Asadero La 44
  '981979f8-9863-4def-9465-ef229cfdb86b': 'photo-1544025162-d76694265947', // Asados de plinio
  '93a77f45-24a4-4e0b-913b-b51fced07378': 'photo-1529193591184-b1d58069ecdd', // Brasero's Steak House
  '7464b57e-0e7e-4367-99d6-bcea6c1b68b0': 'photo-1623653387945-2fd25214f8fc', // Leños y Carbón
  'bfcbafe7-b941-4e72-a4f2-11a825c4381f': 'photo-1600891964092-4316c288032e', // Los asados de segundo
  '928b6dbd-0555-4ae9-a1a2-27b30fad10dd': 'photo-1607013251379-e6eecfffe234', // LPC Parrilla
  '10db2805-39b8-4aa8-87fb-3bdec9443202': 'photo-1530028828-25e8270793c5', // Mis costillitas BBQ
  '1cc6ab06-765d-4a7b-8551-adfff839270d': 'photo-1594041680534-e8c8cdebd659', // Palomulata
  'b6b9ab5c-f23b-4b3d-886a-7d1b44fb8cc0': 'photo-1593504049359-74330189a345', // Pampero Parrilla
  '802d3cdf-963a-4856-8b52-eef9eb15cf7b': 'photo-1565895405138-6c3a1555da6a', // Quisquirisqui
  '38a0ed59-1ea0-478c-9d85-875c9ae5b480': 'photo-1544148103-0773bf10d330', // Rayuela
  'c6563a08-94ca-4c1a-a5bf-b37429aca415': 'photo-1546833999-b9f581a1996d', // Simón Parrilla
  '69e377e8-ef66-46d6-95f2-fb2ff96dc9d3': 'photo-1555939594-58d7cb561ad1', // La Parrilla de Lucho

  // Comidas Rápidas / Hamburguesas
  'a9b0f8c1-968c-4fad-9bc6-d7654c94833b': 'photo-1568901346375-23c9450c58cd', // Bendito pecado 44
  '2d211b46-6c68-4363-a5ef-c30e86e1c47f': 'photo-1586190848861-99aa4a171e90', // Brutales food drinks
  '2249e254-1454-40ef-9b69-330a487560c5': 'photo-1561758033-d89a9ad46330', // Burger Lab Cali
  'd402cd46-1650-4e3d-95ba-dee28ac6c642': 'photo-1550547660-d9450f859349', // Burger Master Granada
  'cd077fc4-50f0-4036-9df3-8335ab84bd54': 'photo-1606131731446-5568d87113aa', // Butcher colombia
  '54ad477f-d0b2-4949-a119-47ccaf58da8c': 'photo-1626700051175-6818013e1d4f', // Casa de la arepa
  'a61acdc7-453a-4913-abf1-6add59743bf3': 'photo-1599599810769-bcde5a160d32', // Chihuahua
  'aaa8a020-3aa9-4b0f-86ae-c26f41db2467': 'photo-1571091718767-18b5b1457add', // El gringo american kitchen
  'da32b271-3654-4226-9792-20ae1803a4f4': 'photo-1565299507177-b0ac66763828', // El paisa
  '4ae5ad7f-92e1-4f7e-81fa-a1716e0a630f': 'photo-1551782450-a2132b4ba21d', // El paso hamburguesas
  'defe753c-3f13-4fde-9d0d-19e77470dfc9': 'photo-1612392062798-2dc1ec5d2c34', // El Rey del Perro
  'd2d0d691-c13f-48b3-b4f4-48b8aa27f04b': 'photo-1601050690597-df0568f70950', // GAÓN
  '240dbbc2-72d8-41a0-8964-d2b83b808703': 'photo-1612392061787-2d078b3e573c', // Hot Dog Boyacá
  '3a37d2be-5c87-4e7b-9d03-ed94fb40a5a5': 'photo-1572802419224-296b0aeee0d9', // La clasica
  '8344dceb-2ca3-4ed2-a8a6-20dd6b154752': 'photo-1620083920192-c9d3b4dfb1f9', // La Picotada
  'a29287b4-47f9-461a-98c4-a2796c45dca2': 'photo-1572802419224-296b0aeee0d9', // Local burger
  '5863f8a1-9ed3-41b5-9f91-743c3957402e': 'photo-1604908176997-125f25cc6f3d', // Maduro Express
  '816de61f-73ec-40a6-a653-f33dbe2932ae': 'photo-1559847844-5315695dadae', // Perreiranos
  'dab18ada-a9a3-41c0-ae63-9ebcdb48a105': 'photo-1572448862527-d3d9b71e8b50', // Republic burger

  // Cafés
  'd0a8e4d0-9b0c-46df-ba51-74542aad2ed6': 'photo-1453614512568-c4024d13c247', // Café Libre
  '0ef79984-1fdc-49fc-926a-079a81265750': 'photo-1501339847302-ac426a4a7cbb', // Café San Alberto
  '7056f100-784c-4dd5-acbc-b88d36d93307': 'photo-1442512595331-e89e73853f31', // Doce Cafe
  'd807647f-0168-45bc-ac9f-fac3753e12e1': 'photo-1554118811-1e0d58224f24', // Lulo Café Bistró
  '32f9a230-8fc7-429d-b7ed-a7c2b689c0d1': 'photo-1495474472287-4d71bcdd2085', // Macondo Café
  '58a589a4-3fc2-497a-b435-51cc59511632': 'photo-1497935586351-b67a49e012bf', // Pergamino Café

  // Food Trucks
  '578eccdd-c1cc-4939-b579-45dc9a055eb4': 'photo-1565299585323-38d6b0865b47', // Burger Truck Pance
  '3a0bddf7-e10b-4696-b268-5f8db526c926': 'photo-1565299507177-b0ac66763828', // El Tucho Food Truck
  '83ce0752-4170-4d07-b028-a474b79dd4b8': 'photo-1559847844-5315695dadae', // Food Truck Park Granada
  'dc8a351a-906a-4447-ba18-14ff67e74d5f': 'photo-1601050690597-df0568f70950', // La Carreta Caleña
  'dfcf8538-c8eb-44e5-bbd6-1a9b63678bac': 'photo-1571091718767-18b5b1457add', // Patio Food Trucks

  // Tradicional / Colombiana
  '1dafa49e-44af-4dab-9f11-5be81c99a118': 'photo-1551218808-94e220e084d2', // Casa Vieja Cali
  '132f78a6-85ed-4fd7-825e-84940ea12ad6': 'photo-1604908554007-3a5fdd2f9b3a', // Choclos y Asados la Finca
  '475c7ebe-1721-4f62-9544-2e2a28a642f7': 'photo-1565557623262-b51c2513a641', // El Solar
  '367c4602-84f3-4677-b0eb-6dc7837d89bc': 'photo-1567337710282-00832b415979', // El Zaguán
  '83731afe-a937-460a-847a-08d4c849e5a6': 'photo-1592861956120-e524fc739696', // Platillos Voladores
  '285b0f72-9b1a-4cec-ae3f-f9abd1bf9ea7': 'photo-1559339352-11d035aa65de', // Ringlete

  // Mariscos
  'e6fbd0b0-548c-49a7-a23b-f57007876c9d': 'photo-1559737558-2f5a35f4523b', // Costa Pacífica
  'd3e7a823-bd4a-45f7-a205-d39b0f746887': 'photo-1532980400857-e8d9d275d858', // El Cangrejo Azul
  'f738b8be-c224-435c-abb7-83b4c5f629b0': 'photo-1579631542720-3a87824fff86', // La Cosecha Marina
  'ee4bfa8e-62b0-4482-a4b4-6f6853b6748e': 'photo-1565680018434-b513d5e5fd47', // Mariscos El Puerto
  '5b808ad1-a1dd-4552-8f18-3cce63474f46': 'photo-1535140728325-a4d3707eee94', // Pesca del Día

  // Italiana
  '9f1e2e39-f6a8-4a3a-9ceb-be4d79bbdfe0': 'photo-1574071318508-1cdbab80d002', // Il Forno
  'abdede6e-46ed-436a-a854-f50d03c9c9ec': 'photo-1551183053-bf91a1d81141', // La Toscana
  'fcd1c30e-eccc-49db-a14f-ec24a75491a8': 'photo-1546549032-9571cd6b27df', // Mamma Mia
  '4e93feb9-05a8-436e-a185-1824d96434ad': 'photo-1595295333158-4742f28fbd85', // Pasta y Pomodoro
  'f7e28935-4c23-4e83-a203-598a01075208': 'photo-1565299624946-b28f40a0ae38', // Pizzería 1969

  // Sushi / Asiática
  '882ae3e5-a704-4a64-a042-420442b59c1e': 'photo-1579871494447-9811cf80d66c', // Osaka Nikkei
  '4e3e67b1-158d-4fde-bf7b-267323c87017': 'photo-1611143669185-af224c5e3252', // Sakura
  'b28e7c6f-de40-4c8e-8040-81eb0987ddcf': 'photo-1553621042-f6e147245754', // Sushi Light
  'e65edff1-0462-4f0a-b248-441af99ce0de': 'photo-1526318896980-cf78c088247c', // Wasabi Sushi Cali
  '0c8ee4b2-323b-40a6-8158-dd750ad26d3a': 'photo-1617196034796-73dfa7b1fd56', // Yu Sushi Bar

  // Rooftop
  'fefc84d5-53fb-4392-b26c-d31071783cb7': 'photo-1559339352-11d035aa65de', // Cielo Bar & Lounge
  'd9d70c79-e98d-41f0-a5ad-29d69d0ed54a': 'photo-1414235077428-338989a2e8c0', // Mirador San Antonio
  '24a2e635-12dc-4b29-89ee-4b9fc51d4972': 'photo-1551918120-9739cb430c6d', // Rooftop Granada 360
  '461af9cb-f927-483e-ba40-68729f3ea291': 'photo-1424847651672-bf20a4b0982b', // Sky Bar Cali
  'e7480ae7-5190-43d9-8cd8-728877571ece': 'photo-1517248135467-4c7edcad34c4', // Terraza El Peñón

  // Saludable
  'd36041d6-6da7-44ed-b410-b17a4b654a8d': 'photo-1512621776951-a57141f2eefd', // Nutri Bowl
  '4f27ff35-6759-413d-af98-4147bfccf341': 'photo-1490645935967-10de6ba17061', // Raíz Orgánica
  'b18e4e21-8825-43ba-8f02-63c00c1b8c18': 'photo-1546069901-ba9599a7e63c', // Sano y Sabroso
  '0c2d6a43-5fa8-46e6-adf5-8c9b03d97320': 'photo-1505253758473-96b7015fcd40', // Verde Vida
  'eb3fd56d-98d2-4670-b6ec-4f8b1768f67b': 'photo-1540420773420-3366772f4999', // Vida Verde Pance

  // Remate / Salsa
  '82a53ac3-f5a3-4b19-a303-8ebd93b82d1b': 'photo-1572116469696-31de0f17cc34', // Changó
  'ab5b4329-abe0-48b2-8b86-b0ba3f33833e': 'photo-1514933651103-005eec06c04b', // El Habanero
  'e4e870ea-b153-4915-8278-2a23cf346cee': 'photo-1566417713940-fe7c737a9ef2', // La Matraca
  '00a90c2a-430f-4c8e-9a40-dac849bbe8f4': 'photo-1543007630-9710e4a00a20', // Tin Tin Deo
  'f5dbc068-8e4c-4fc0-b427-0766d70d9d08': 'photo-1470337458703-46ad1756a187', // Zaperoco Bar
};

export const RESTAURANT_IMAGE_OVERRIDES: Record<string, string> = Object.fromEntries(
  Object.entries(OVERRIDES_RAW).map(([id, photoId]) => [id, img(photoId)])
);

// ---------------------------------------------------------------------------
// 2) Per-category pools (used only when no override and no uploaded photo).
// ---------------------------------------------------------------------------
export const CATEGORY_FALLBACK_POOLS: Record<string, string[]> = {
  'Comidas Rápidas': pool(['photo-1568901346375-23c9450c58cd','photo-1586190848861-99aa4a171e90','photo-1561758033-d89a9ad46330','photo-1550547660-d9450f859349','photo-1606131731446-5568d87113aa']),
  'Rápidas': pool(['photo-1568901346375-23c9450c58cd','photo-1561758033-d89a9ad46330','photo-1550547660-d9450f859349','photo-1612392062798-2dc1ec5d2c34','photo-1572802419224-296b0aeee0d9']),
  'Café': pool(['photo-1453614512568-c4024d13c247','photo-1501339847302-ac426a4a7cbb','photo-1442512595331-e89e73853f31','photo-1554118811-1e0d58224f24','photo-1495474472287-4d71bcdd2085']),
  'Cafés': pool(['photo-1453614512568-c4024d13c247','photo-1501339847302-ac426a4a7cbb','photo-1442512595331-e89e73853f31','photo-1554118811-1e0d58224f24','photo-1497935586351-b67a49e012bf']),
  'Food Truck': pool(['photo-1565299585323-38d6b0865b47','photo-1565299507177-b0ac66763828','photo-1559847844-5315695dadae','photo-1601050690597-df0568f70950','photo-1571091718767-18b5b1457add']),
  'Mexicana': pool(['photo-1565299624946-b28f40a0ae38','photo-1599974579688-8dbdd335c77f','photo-1604467794349-0b74285de7e7','photo-1613514785940-daed07799d9b','photo-1606761568499-6d2451b23c66']),
  'Asiática': pool(['photo-1579871494447-9811cf80d66c','photo-1517248135467-4c7edcad34c4','photo-1611143669185-af224c5e3252','photo-1553621042-f6e147245754','photo-1526318896980-cf78c088247c']),
  'Sushi': pool(['photo-1579871494447-9811cf80d66c','photo-1611143669185-af224c5e3252','photo-1553621042-f6e147245754','photo-1526318896980-cf78c088247c','photo-1617196034796-73dfa7b1fd56']),
  'Bar': pool(['photo-1514933651103-005eec06c04b','photo-1572116469696-31de0f17cc34','photo-1543007630-9710e4a00a20','photo-1538488881038-e252a119ace7','photo-1470337458703-46ad1756a187']),
  'Cerveza': pool(['photo-1535958636474-b021ee887b13','photo-1546726747-421c6d69c929','photo-1571767454098-246b94fbcf38','photo-1577905394164-d566267e7c46','photo-1518176258769-f227c798150e']),
  'Parrilla': pool(['photo-1558030006-450675393462','photo-1544025162-d76694265947','photo-1529193591184-b1d58069ecdd','photo-1623653387945-2fd25214f8fc','photo-1600891964092-4316c288032e']),
  'Italiana': pool(['photo-1565299624946-b28f40a0ae38','photo-1551183053-bf91a1d81141','photo-1574071318508-1cdbab80d002','photo-1595295333158-4742f28fbd85','photo-1546549032-9571cd6b27df']),
  'Rooftop': pool(['photo-1559339352-11d035aa65de','photo-1517248135467-4c7edcad34c4','photo-1551918120-9739cb430c6d','photo-1414235077428-338989a2e8c0','photo-1424847651672-bf20a4b0982b']),
  'Tradicional': pool(['photo-1551218808-94e220e084d2','photo-1604908554007-3a5fdd2f9b3a','photo-1565557623262-b51c2513a641','photo-1567337710282-00832b415979','photo-1592861956120-e524fc739696']),
  'Remate': pool(['photo-1572116469696-31de0f17cc34','photo-1514933651103-005eec06c04b','photo-1566417713940-fe7c737a9ef2','photo-1543007630-9710e4a00a20','photo-1470337458703-46ad1756a187']),
  'Mariscos': pool(['photo-1559737558-2f5a35f4523b','photo-1559339352-11d035aa65de','photo-1565299585323-38d6b0865b47','photo-1532980400857-e8d9d275d858','photo-1579631542720-3a87824fff86']),
  'Saludable': pool(['photo-1512621776951-a57141f2eefd','photo-1490645935967-10de6ba17061','photo-1546069901-ba9599a7e63c','photo-1505253758473-96b7015fcd40','photo-1540420773420-3366772f4999']),
  'Postres': pool(['photo-1488477181946-6428a0291777','photo-1551024506-0bccd828d307','photo-1497034825429-c343d7c6a68f','photo-1565958011703-44f9829ba187','photo-1563729784474-d77dbb933a9e']),
  'Panadería': pool(['photo-1509440159596-0249088772ff','photo-1555507036-ab1f4038808a','photo-1568254183919-78a4f43a2877','photo-1517686469429-8bdb88b9f907','photo-1608198093002-ad4e005484ec']),
};

const DEFAULT_POOL = pool([
  'photo-1517248135467-4c7edcad34c4',
  'photo-1414235077428-338989a2e8c0',
  'photo-1555396273-367ea4eb4db5',
  'photo-1466978913421-dad2ebd01d17',
  'photo-1559339352-11d035aa65de',
]);

const hash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

/**
 * Returns a high-quality image for a business. Resolution order:
 *   1) Per-restaurant override keyed by business id.
 *   2) Deterministic pick from the category pool, seeded by id/name.
 *   3) Default pool.
 */
export const getCategoryFallbackImage = (
  category?: string | null,
  seed?: string | null,
): string => {
  if (seed && RESTAURANT_IMAGE_OVERRIDES[seed]) return RESTAURANT_IMAGE_OVERRIDES[seed];
  const list = (category && CATEGORY_FALLBACK_POOLS[category]) || DEFAULT_POOL;
  if (!seed) return list[0];
  return list[hash(seed) % list.length];
};
