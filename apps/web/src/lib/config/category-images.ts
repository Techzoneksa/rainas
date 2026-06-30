import {
  getCategoryFallbackImage,
  getCategoryBanner,
  getCategoryAccentColor as getAccentColor,
  getCategoryDescription,
  getVisualByUrlSlug,
} from "@/lib/category-visuals";

export { getVisualByUrlSlug };

export const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1585381299351-7a5e29ca6f8d?w=1200&h=800&fit=crop&q=80";

export function getCategoryImageUrl(
  slug: string,
  apiUrl: string | null | undefined,
): string {
  if (apiUrl && typeof apiUrl === "string" && apiUrl.length > 0 && apiUrl !== "/image") {
    return apiUrl;
  }
  return getCategoryFallbackImage(slug, 0);
}

export function getCategoryHeroUrl(urlSlug: string): string {
  return getCategoryBanner(urlSlug);
}

export function safeImageUrl(url: string | null | undefined): string {
  if (url && url.length > 0 && url !== "/image") return url;
  return DEFAULT_IMAGE_URL;
}

export function getCategoryAccentColor(urlSlug: string): string {
  return getAccentColor(urlSlug);
}

export function getCategoryDescriptionAr(urlSlug: string): string {
  return getCategoryDescription(urlSlug);
}