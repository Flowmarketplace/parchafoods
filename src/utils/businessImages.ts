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
 * Returns the single best cover image URL for a business card/thumbnail.
 * Falls back to a per-restaurant/category image if no real photos exist.
 */
export function pickBusinessCoverUrl(
  images: BusinessImageLike[] | null | undefined,
  business: { id?: string | null; name?: string | null; category?: string | null }
): string {
  const ordered = pickBusinessCoverImages(images);
  return (
    ordered[0]?.image_url ||
    getCategoryFallbackImage(business.category || '', business.id || business.name || '')
  );
}
