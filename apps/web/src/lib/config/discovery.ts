import { getCategoryCircleImage, getCategoryFallbackImage } from "@/lib/category-visuals";

export interface NavCategory {
  slug: string;
  nameAr: string;
  href: string;
}

export interface DiscoveryCircle {
  id: string;
  nameAr: string;
  imageUrl: string;
  href: string;
}

export interface HeroSlide {
  id: string;
  imageUrl: string;
}

export interface SectionCard {
  id: string;
  nameAr: string;
  description: string;
  imageUrl: string;
  href: string;
}

export const navCategories: NavCategory[] = [
  { slug: "electronics", nameAr: "إلكترونيات", href: "/categories/electronics" },
  { slug: "beauty", nameAr: "جمال وعطور", href: "/categories/beauty" },
  { slug: "home", nameAr: "منزل ومطبخ", href: "/categories/home" },
  { slug: "grocery", nameAr: "بقالة", href: "/categories/grocery" },
  { slug: "fashion-men", nameAr: "أزياء رجالية", href: "/categories/fashion-men" },
  { slug: "fashion-women", nameAr: "أزياء نسائية", href: "/categories/fashion-women" },
  { slug: "baby", nameAr: "أطفال رضع", href: "/categories/baby" },
  { slug: "toys", nameAr: "ألعاب", href: "/categories/toys" },
  { slug: "fashion-kids", nameAr: "أزياء أطفال", href: "/categories/fashion-kids" },
  { slug: "sports", nameAr: "رياضة وخارج المنزل", href: "/categories/sports" },
  { slug: "health", nameAr: "صحة وتغذية", href: "/categories/health" },
  { slug: "stationery", nameAr: "قرطاسية", href: "/categories/stationery" },
  { slug: "books", nameAr: "كتب وإعلام", href: "/categories/books" },
  { slug: "automotive", nameAr: "سيارات", href: "/categories/automotive" },
];

const unsplashBanner = (id: string, w = 1200, h = 500) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

function circleImage(categorySlug: string): string {
  return getCategoryCircleImage(categorySlug);
}

function fallbackImage(categorySlug: string, index = 0): string {
  return getCategoryFallbackImage(categorySlug, index);
}

export const discoveryCircles: DiscoveryCircle[] = [
  {
    id: "beauty-perfumes",
    nameAr: "عطور",
    imageUrl: circleImage("beauty"),
    href: "/categories/beauty",
  },
  {
    id: "beauty-makeup",
    nameAr: "مكياج",
    imageUrl: fallbackImage("beauty", 1),
    href: "/categories/beauty",
  },
  {
    id: "beauty-skincare",
    nameAr: "عناية بالبشرة",
    imageUrl: fallbackImage("beauty", 2),
    href: "/categories/beauty",
  },
  {
    id: "fashion-bags",
    nameAr: "شنط",
    imageUrl: fallbackImage("fashion-women", 0),
    href: "/categories/fashion-women",
  },
  {
    id: "fashion-shoes",
    nameAr: "أحذية",
    imageUrl: fallbackImage("fashion-women", 1),
    href: "/categories/fashion-women",
  },
  {
    id: "fashion-abayas",
    nameAr: "عبايات",
    imageUrl: fallbackImage("fashion-women", 2),
    href: "/categories/fashion-women",
  },
  {
    id: "fashion-accessories",
    nameAr: "إكسسوارات",
    imageUrl: fallbackImage("fashion-women", 3),
    href: "/categories/fashion-women",
  },
  {
    id: "home-kitchen",
    nameAr: "منزل ومطبخ",
    imageUrl: circleImage("home"),
    href: "/categories/home",
  },
  {
    id: "sports",
    nameAr: "رياضة",
    imageUrl: circleImage("sports"),
    href: "/categories/sports",
  },
  {
    id: "health",
    nameAr: "صحة وتغذية",
    imageUrl: circleImage("health"),
    href: "/categories/health",
  },
  {
    id: "electronics",
    nameAr: "إلكترونيات",
    imageUrl: circleImage("electronics"),
    href: "/categories/electronics",
  },
  {
    id: "baby",
    nameAr: "أطفال رضع",
    imageUrl: circleImage("baby"),
    href: "/categories/baby",
  },
  {
    id: "toys",
    nameAr: "ألعاب",
    imageUrl: circleImage("toys"),
    href: "/categories/toys",
  },
  {
    id: "books",
    nameAr: "كتب وإعلام",
    imageUrl: circleImage("books"),
    href: "/categories/books",
  },
];

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    imageUrl: unsplashBanner("1483985988355-763728e1935b", 1200, 500),
  },
  {
    id: "slide-2",
    imageUrl: unsplashBanner("1523275335684-37898b6baf30", 1200, 500),
  },
  {
    id: "slide-3",
    imageUrl: unsplashBanner("1556742049-0cfed4f6a45d", 1200, 500),
  },
];

export const womenDiscoveryCards: SectionCard[] = [
  {
    id: "beauty-perfumes",
    nameAr: "عطور نسائية",
    description: "أجمل العطور العربية والفرنسية بانطباعات حقيقية",
    imageUrl: fallbackImage("beauty", 0),
    href: "/categories/beauty",
  },
  {
    id: "beauty-makeup",
    nameAr: "مكياج يومي",
    description: "أساسيات المكياج وأفضل المنتجات لتجربتها",
    imageUrl: fallbackImage("beauty", 1),
    href: "/categories/beauty",
  },
  {
    id: "beauty-skincare",
    nameAr: "عناية بالبشرة",
    description: "منتجات العناية الأكثر تداولاً بين البنات",
    imageUrl: fallbackImage("beauty", 2),
    href: "/categories/beauty",
  },
  {
    id: "beauty-haircare",
    nameAr: "عناية بالشعر",
    description: "شامبوهات وزيوت ومنتجات تصفيف موثوقة",
    imageUrl: fallbackImage("beauty", 3),
    href: "/categories/beauty",
  },
  {
    id: "fashion-bags",
    nameAr: "شنط",
    description: "أحدث صيحات الشنط والمحافظ النسائية",
    imageUrl: fallbackImage("fashion-women", 0),
    href: "/categories/fashion-women",
  },
  {
    id: "fashion-shoes",
    nameAr: "أحذية",
    description: "أحذية عصرية بتنوع يناسب كل الإطلالات",
    imageUrl: fallbackImage("fashion-women", 1),
    href: "/categories/fashion-women",
  },
  {
    id: "fashion-abayas",
    nameAr: "عبايات",
    description: "تشكيلة عبايات عصرية ومحتشمة",
    imageUrl: fallbackImage("fashion-women", 2),
    href: "/categories/fashion-women",
  },
  {
    id: "fashion-jewelry",
    nameAr: "مجوهرات",
    description: "قطع مميزة من المجوهرات والإكسسوارات",
    imageUrl: fallbackImage("fashion-women", 4),
    href: "/categories/fashion-women",
  },
];

export const beautyCards: SectionCard[] = [
  {
    id: "beauty-perfumes",
    nameAr: "عطور نسائية",
    description: "أفضل العطور العربية والفرنسية",
    imageUrl: fallbackImage("beauty", 0),
    href: "/categories/beauty",
  },
  {
    id: "beauty-makeup",
    nameAr: "مكياج",
    description: "أساسيات المكياج اليومي",
    imageUrl: fallbackImage("beauty", 1),
    href: "/categories/beauty",
  },
  {
    id: "beauty-skincare",
    nameAr: "عناية بالبشرة",
    description: "منتجات العناية والروتين اليومي",
    imageUrl: fallbackImage("beauty", 2),
    href: "/categories/beauty",
  },
  {
    id: "beauty-haircare",
    nameAr: "عناية بالشعر",
    description: "شامبوهات وزيوت ومنتجات تصفيف",
    imageUrl: fallbackImage("beauty", 3),
    href: "/categories/beauty",
  },
];

export const fashionCards: SectionCard[] = [
  {
    id: "fashion-abayas",
    nameAr: "عبايات",
    description: "تشكيلة عبايات عصرية ومحتشمة",
    imageUrl: fallbackImage("fashion-women", 2),
    href: "/categories/fashion-women",
  },
  {
    id: "fashion-dresses",
    nameAr: "فساتين",
    description: "تصاميم فساتين تناسب كل الأوقات",
    imageUrl: fallbackImage("fashion-women", 3),
    href: "/categories/fashion-women",
  },
  {
    id: "fashion-bags",
    nameAr: "شنط",
    description: "أحدث صيحات الشنط والمحافظ",
    imageUrl: fallbackImage("fashion-women", 0),
    href: "/categories/fashion-women",
  },
  {
    id: "fashion-shoes",
    nameAr: "أحذية",
    description: "أحذية عصرية لكل الإطلالات",
    imageUrl: fallbackImage("fashion-women", 1),
    href: "/categories/fashion-women",
  },
  {
    id: "fashion-accessories",
    nameAr: "إكسسوارات",
    description: "قطع مميزة تكمل إطلالتك",
    imageUrl: fallbackImage("fashion-women", 3),
    href: "/categories/fashion-women",
  },
  {
    id: "fashion-jewelry",
    nameAr: "مجوهرات",
    description: "قطع مميزة من المجوهرات",
    imageUrl: fallbackImage("fashion-women", 4),
    href: "/categories/fashion-women",
  },
];