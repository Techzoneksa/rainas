<<<<<<< HEAD
=======
import {
  getCategoryFallbackImage,
  getCategoryBanner,
  getCategoryAccentColor as getAccentColor,
  getCategoryDescription,
  getVisualByUrlSlug,
} from "@/lib/category-visuals";

export { getVisualByUrlSlug };

>>>>>>> f79a2f1 (fix: correctly bind category visuals and filtered content)
export const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1585381299351-7a5e29ca6f8d?w=1200&h=800&fit=crop&q=80";

const fallbackBase = (photoId: string): string =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=400&h=400&q=80`;

const heroBase = (photoId: string): string =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=1200&h=600&q=80`;

export const categoryFallbackImages: Record<string, string> = {
  electronics: fallbackBase("1468495244123-6c6c332eeece"),
  beauty: fallbackBase("1596462502278-27bfdc403348"),
  home: fallbackBase("1556909114-f6e7ad7d3136"),
  food: fallbackBase("1504674900247-0877df9cc836"),
  fashion: fallbackBase("1445205170230-053b83016050"),
  kids: fallbackBase("1546435770-a3e426bf472b"),
  sports: fallbackBase("1461896836934-bd45ba8fcf9b"),
  books: fallbackBase("1495446815901-a7297e633e8d"),
  "women-fashion": fallbackBase("1581044777559-4c0e0c9f0f3c"),
  fragrance: fallbackBase("1541643604580-e61e0fbce47a"),
  makeup: fallbackBase("1522337360788-0ce7fd0cb18a"),
  skincare: fallbackBase("1570194065650-d99fb4b38e16"),
  bags: fallbackBase("1566156025215-0f63b1a1049a"),
  shoes: fallbackBase("1595950652906-58ea8b45e48c"),
  accessories: fallbackBase("1606761566779-6d4f029b24d8"),
  sunglasses: fallbackBase("1572635196237-14b3f281503f"),
  automotive: fallbackBase("1449965408659-2f64b6b1a1d2"),
};

export const heroFallbackImages: Record<string, string> = {
  electronics: heroBase("1498050108023-c5249f4df085"),
  beauty: heroBase("1596462502278-27bfdc403348"),
  home: heroBase("1556909114-f6e7ad7d3136"),
  food: heroBase("1504674900247-0877df9cc836"),
  fashion: heroBase("1445205170230-053b83016050"),
  kids: heroBase("1546435770-a3e426bf472b"),
  sports: heroBase("1461896836934-bd45ba8fcf9b"),
  books: heroBase("1495446815901-a7297e633e8d"),
  "women-fashion": heroBase("1581044777559-4c0e0c9f0f3c"),
  fragrance: heroBase("1541643604580-e61e0fbce47a"),
  makeup: heroBase("1522337360788-0ce7fd0cb18a"),
  skincare: heroBase("1570194065650-d99fb4b38e16"),
  bags: heroBase("1566156025215-0f63b1a1049a"),
  shoes: heroBase("1595950652906-58ea8b45e48c"),
  accessories: heroBase("1606761566779-6d4f029b24d8"),
  automotive: heroBase("1449965408659-2f64b6b1a1d2"),
};

export function getCategoryImageUrl(slug: string, apiUrl: string | null | undefined): string {
  const fallback = categoryFallbackImages[slug];
  if (fallback) return fallback;
  if (apiUrl && apiUrl.length > 0 && apiUrl !== "/image") return apiUrl;
  return DEFAULT_IMAGE_URL;
}

<<<<<<< HEAD
export function getCategoryHeroUrl(slug: string): string {
  return heroFallbackImages[slug] ?? DEFAULT_IMAGE_URL;
=======
export function getCategoryHeroUrl(urlSlug: string): string {
  return getCategoryBanner(urlSlug);
>>>>>>> f79a2f1 (fix: correctly bind category visuals and filtered content)
}

export function safeImageUrl(url: string | null | undefined): string {
  if (url && url.length > 0 && url !== "/image") return url;
  return DEFAULT_IMAGE_URL;
}
<<<<<<< HEAD
=======

export function getCategoryAccentColor(urlSlug: string): string {
  return getAccentColor(urlSlug);
}

export function getCategoryDescriptionAr(urlSlug: string): string {
  return getCategoryDescription(urlSlug);
}
>>>>>>> f79a2f1 (fix: correctly bind category visuals and filtered content)
