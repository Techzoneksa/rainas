import {
  getCategoryFallbackImage,
  getCategoryBanner,
  getCategoryVisual,
} from "@/lib/category-visuals";

export { getCategoryVisual, getCategoryFallbackImage } from "@/lib/category-visuals";

export const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1585381299351-7a5e29ca6f8d?w=1200&h=800&fit=crop&q=80";

export function getCategoryImageUrl(
  slug: string,
  apiUrl: string | null | undefined,
): string {
  const fallback = getCategoryFallbackImage(slug, 0);
  if (fallback) return fallback;
  if (apiUrl && apiUrl.length > 0 && apiUrl !== "/image") return apiUrl;
  return DEFAULT_IMAGE_URL;
}

export function getCategoryHeroUrl(slug: string): string {
  return getCategoryBanner(slug);
}

export function safeImageUrl(url: string | null | undefined): string {
  if (url && url.length > 0 && url !== "/image") return url;
  return DEFAULT_IMAGE_URL;
}

export function getCategoryAccentColor(slug: string): string {
  const visual = getCategoryVisual(slug);
  return visual?.accentColor ?? "#FFCE00";
}

export function getCategoryDescriptionAr(slug: string): string {
  const visual = getCategoryVisual(slug);
  return visual?.descriptionAr ?? "";
}