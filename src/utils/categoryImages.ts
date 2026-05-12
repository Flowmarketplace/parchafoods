// High-quality Unsplash fallbacks per category. Sized 1600px wide, q=85, auto-format.
// Used as cover/profile fallback when a business has no uploaded images.
const PARAMS = '?w=1600&q=85&auto=format&fit=crop';

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Comidas Rápidas': `https://images.unsplash.com/photo-1568901346375-23c9450c58cd${PARAMS}`,
  'Café': `https://images.unsplash.com/photo-1453614512568-c4024d13c247${PARAMS}`,
  'Food Truck': `https://images.unsplash.com/photo-1565299585323-38d6b0865b47${PARAMS}`,
  'Mexicana': `https://images.unsplash.com/photo-1565299585323-38174c4a6471${PARAMS}`,
  'Asiática': `https://images.unsplash.com/photo-1579871494447-9811cf80d66c${PARAMS}`,
  'Bar': `https://images.unsplash.com/photo-1514933651103-005eec06c04b${PARAMS}`,
  'Parrilla': `https://images.unsplash.com/photo-1558030006-450675393462${PARAMS}`,
  'Italiana': `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38${PARAMS}`,
  'Rooftop': `https://images.unsplash.com/photo-1559339352-11d035aa65de${PARAMS}`,
  'Tradicional': `https://images.unsplash.com/photo-1551218808-94e220e084d2${PARAMS}`,
  'Remate': `https://images.unsplash.com/photo-1572116469696-31de0f17cc34${PARAMS}`,
  'Mariscos': `https://images.unsplash.com/photo-1559737558-2f5a35f4523b${PARAMS}`,
  'Saludable': `https://images.unsplash.com/photo-1512621776951-a57141f2eefd${PARAMS}`,
  'Postres': `https://images.unsplash.com/photo-1488477181946-6428a0291777${PARAMS}`,
  'Panadería': `https://images.unsplash.com/photo-1509440159596-0249088772ff${PARAMS}`,
};

const DEFAULT_FALLBACK = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4${PARAMS}`;

export const getCategoryFallbackImage = (category?: string | null): string => {
  if (!category) return DEFAULT_FALLBACK;
  return CATEGORY_FALLBACK_IMAGES[category] || DEFAULT_FALLBACK;
};
