import { getCategoryFallbackImage, RESTAURANT_IMAGE_OVERRIDES } from './categoryImages';

export interface BusinessImageLike {
  image_url: string;
  image_type?: string | null;
  is_primary?: boolean | null;
  display_order?: number | null;
  description?: string | null;
}

/**
 * Sort images by display_order then prioritize real cover/gallery photos
 * over the profile image (which is usually a logo).
 * Order: gallery → primary (non-profile) → any non-profile → profile.
 */
export function pickBusinessCoverImages<T extends BusinessImageLike>(images: T[] | null | undefined): T[] {
  const sorted = [...(images || [])].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );
  const nonProfile = sorted.filter((img) => img.image_type !== 'profile');
  const gallery = nonProfile.filter((img) => img.image_type === 'gallery');
  if (gallery.length > 0) return gallery;
  if (nonProfile.length > 0) return nonProfile;
  return sorted;
}

/**
 * Downsizes remote images so cards load fast.
 * - Unsplash: rewrite width/quality params.
 * - Supabase storage: leave untouched (originals are already uploaded sized).
 */
export function optimizeImageUrl(url: string, width = 800, quality = 70): string {
  if (!url) return url;
  if (url.includes('images.unsplash.com')) {
    const [base] = url.split('?');
    return `${base}?w=${width}&q=${quality}&auto=format&fit=crop`;
  }
  return url;
}

/**
 * Returns the single best cover image URL for a business card/thumbnail.
 * Falls back to a per-restaurant/category image if no real photos exist.
 */
export function pickBusinessCoverUrl(
  images: BusinessImageLike[] | null | undefined,
  business: {
    id?: string | null;
    name?: string | null;
    category?: string | null;
    business_type?: string | null;
    businessType?: string | null;
  }
): string {
  const id = business.id || '';
  // Force-override only for businesses with a local uploaded asset (non-Unsplash URL).
  // This avoids replacing real photos uploaded by other businesses.
  const override = id ? RESTAURANT_IMAGE_OVERRIDES[id] : undefined;
  if (override && !override.includes('unsplash.com')) return override;
  const ordered = pickBusinessCoverImages(images);
  return optimizeImageUrl(
    ordered[0]?.image_url ||
      getCategoryFallbackImage(
        business.category || '',
        id || business.name || '',
        business.name || '',
        business.business_type || business.businessType || ''
      )
  );
}

