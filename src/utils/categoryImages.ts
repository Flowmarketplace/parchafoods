// High-quality Unsplash fallback pools per category. Each category has multiple
// images so different businesses get different but consistent photos.
const PARAMS = '?w=1600&q=85&auto=format&fit=crop';

const pool = (ids: string[]) => ids.map(id => `https://images.unsplash.com/${id}${PARAMS}`);

export const CATEGORY_FALLBACK_POOLS: Record<string, string[]> = {
  'Comidas Rápidas': pool([
    'photo-1568901346375-23c9450c58cd',
    'photo-1586190848861-99aa4a171e90',
    'photo-1561758033-d89a9ad46330',
    'photo-1550547660-d9450f859349',
    'photo-1606131731446-5568d87113aa',
  ]),
  'Café': pool([
    'photo-1453614512568-c4024d13c247',
    'photo-1501339847302-ac426a4a7cbb',
    'photo-1442512595331-e89e73853f31',
    'photo-1554118811-1e0d58224f24',
    'photo-1495474472287-4d71bcdd2085',
  ]),
  'Food Truck': pool([
    'photo-1565299585323-38d6b0865b47',
    'photo-1565299507177-b0ac66763828',
    'photo-1559847844-5315695dadae',
    'photo-1601050690597-df0568f70950',
    'photo-1571091718767-18b5b1457add',
  ]),
  'Mexicana': pool([
    'photo-1565299624946-b28f40a0ae38',
    'photo-1599974579688-8dbdd335c77f',
    'photo-1604467794349-0b74285de7e7',
    'photo-1613514785940-daed07799d9b',
    'photo-1606761568499-6d2451b23c66',
  ]),
  'Asiática': pool([
    'photo-1579871494447-9811cf80d66c',
    'photo-1517248135467-4c7edcad34c4',
    'photo-1611143669185-af224c5e3252',
    'photo-1553621042-f6e147245754',
    'photo-1526318896980-cf78c088247c',
  ]),
  'Bar': pool([
    'photo-1514933651103-005eec06c04b',
    'photo-1572116469696-31de0f17cc34',
    'photo-1543007630-9710e4a00a20',
    'photo-1538488881038-e252a119ace7',
    'photo-1470337458703-46ad1756a187',
  ]),
  'Cerveza': pool([
    'photo-1535958636474-b021ee887b13',
    'photo-1546726747-421c6d69c929',
    'photo-1571767454098-246b94fbcf38',
    'photo-1577905394164-d566267e7c46',
    'photo-1518176258769-f227c798150e',
  ]),
  'Parrilla': pool([
    'photo-1558030006-450675393462',
    'photo-1544025162-d76694265947',
    'photo-1529193591184-b1d58069ecdd',
    'photo-1623653387945-2fd25214f8fc',
    'photo-1600891964092-4316c288032e',
  ]),
  'Italiana': pool([
    'photo-1565299624946-b28f40a0ae38',
    'photo-1551183053-bf91a1d81141',
    'photo-1574071318508-1cdbab80d002',
    'photo-1595295333158-4742f28fbd85',
    'photo-1546549032-9571cd6b27df',
  ]),
  'Rooftop': pool([
    'photo-1559339352-11d035aa65de',
    'photo-1517248135467-4c7edcad34c4',
    'photo-1551918120-9739cb430c6d',
    'photo-1414235077428-338989a2e8c0',
    'photo-1424847651672-bf20a4b0982b',
  ]),
  'Tradicional': pool([
    'photo-1551218808-94e220e084d2',
    'photo-1604908554007-3a5fdd2f9b3a',
    'photo-1565557623262-b51c2513a641',
    'photo-1567337710282-00832b415979',
    'photo-1592861956120-e524fc739696',
  ]),
  'Remate': pool([
    'photo-1572116469696-31de0f17cc34',
    'photo-1514933651103-005eec06c04b',
    'photo-1566417713940-fe7c737a9ef2',
    'photo-1543007630-9710e4a00a20',
    'photo-1470337458703-46ad1756a187',
  ]),
  'Mariscos': pool([
    'photo-1559737558-2f5a35f4523b',
    'photo-1559339352-11d035aa65de',
    'photo-1565299585323-38d6b0865b47',
    'photo-1532980400857-e8d9d275d858',
    'photo-1579631542720-3a87824fff86',
  ]),
  'Saludable': pool([
    'photo-1512621776951-a57141f2eefd',
    'photo-1490645935967-10de6ba17061',
    'photo-1546069901-ba9599a7e63c',
    'photo-1505253758473-96b7015fcd40',
    'photo-1540420773420-3366772f4999',
  ]),
  'Postres': pool([
    'photo-1488477181946-6428a0291777',
    'photo-1551024506-0bccd828d307',
    'photo-1497034825429-c343d7c6a68f',
    'photo-1565958011703-44f9829ba187',
    'photo-1563729784474-d77dbb933a9e',
  ]),
  'Panadería': pool([
    'photo-1509440159596-0249088772ff',
    'photo-1555507036-ab1f4038808a',
    'photo-1568254183919-78a4f43a2877',
    'photo-1517686469429-8bdb88b9f907',
    'photo-1608198093002-ad4e005484ec',
  ]),
};

const DEFAULT_POOL = pool([
  'photo-1517248135467-4c7edcad34c4',
  'photo-1414235077428-338989a2e8c0',
  'photo-1555396273-367ea4eb4db5',
  'photo-1466978913421-dad2ebd01d17',
  'photo-1559339352-11d035aa65de',
]);

// Stable hash of a string -> integer
const hash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

/**
 * Returns a deterministic high-quality fallback image for a business based on
 * its category and a stable seed (name or id). Each business in the same
 * category gets a different image, but the same business always gets the same.
 */
export const getCategoryFallbackImage = (category?: string | null, seed?: string | null): string => {
  const list = (category && CATEGORY_FALLBACK_POOLS[category]) || DEFAULT_POOL;
  if (!seed) return list[0];
  return list[hash(seed) % list.length];
};
