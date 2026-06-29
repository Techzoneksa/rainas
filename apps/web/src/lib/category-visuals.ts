export interface CategoryVisual {
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  bannerImage: string;
  circleImage: string;
  fallbackImages: string[];
  accentColor: string;
}

const unsplash = (id: string, w = 1200, h = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const unsplashCircle = (id: string) => unsplash(id, 200, 200);

const unsplashFallback = (id: string) => unsplash(id, 400, 400);

export const CATEGORY_VISUALS: CategoryVisual[] = [
  {
    slug: "electronics",
    nameAr: "إلكترونيات",
    nameEn: "Electronics",
    descriptionAr: "تجارب المستخدمين مع الجوالات، السماعات، الأجهزة الذكية، والإكسسوارات التقنية.",
    bannerImage: unsplash("1468495244123-6c6c332eeece", 1200, 600),
    circleImage: unsplashCircle("1468495244123-6c6c332eeece"),
    fallbackImages: [
      unsplashFallback("1468495244123-6c6c332eeece"),
      unsplashFallback("1498050108023-c5249f4df085"),
      unsplashFallback("1523275335684-37898b6baf30"),
      unsplashFallback("1519389950473-47ba0277781c"),
    ],
    accentColor: "#0EA5E9",
  },
  {
    slug: "beauty",
    nameAr: "جمال وعطور",
    nameEn: "Beauty & Fragrance",
    descriptionAr: "اكتشفي تجارب المستخدمين مع العطور، المكياج، العناية بالبشرة، والعناية بالشعر.",
    bannerImage: unsplash("1596462502278-27bfdc403348", 1200, 600),
    circleImage: unsplashCircle("1596462502278-27bfdc403348"),
    fallbackImages: [
      unsplashFallback("1596462502278-27bfdc403348"),
      unsplashFallback("1522337360788-0ce7fd0cb18a"),
      unsplashFallback("1541643604580-e61e0fbce47a"),
      unsplashFallback("1570194065650-d99fb4b38e16"),
      unsplashFallback("1598440947619-2c35fc9aa908"),
      unsplashFallback("1594035910387-fea47794261f"),
    ],
    accentColor: "#EC4899",
  },
  {
    slug: "home",
    nameAr: "منزل ومطبخ",
    nameEn: "Home & Kitchen",
    descriptionAr: "تجارب حقيقية مع أدوات المطبخ، الأجهزة المنزلية، ومنتجات البيت اليومية.",
    bannerImage: unsplash("1556909114-f6e7ad7d3136", 1200, 600),
    circleImage: unsplashCircle("1556909114-f6e7ad7d3136"),
    fallbackImages: [
      unsplashFallback("1556909114-f6e7ad7d3136"),
      unsplashFallback("1558618666-fcd25c85cd64"),
      unsplashFallback("1574269906582-6f61d7a8b3f1"),
      unsplashFallback("1600585154340-be6161a56a0c"),
    ],
    accentColor: "#A78BFA",
  },
  {
    slug: "grocery",
    nameAr: "بقالة",
    nameEn: "Grocery",
    descriptionAr: "آراء وتجارب حول المنتجات الغذائية، القهوة، السناكات، ومشتريات البقالة اليومية.",
    bannerImage: unsplash("1504674900247-0877df9cc836", 1200, 600),
    circleImage: unsplashCircle("1504674900247-0877df9cc836"),
    fallbackImages: [
      unsplashFallback("1504674900247-0877df9cc836"),
      unsplashFallback("1495474472287-4d71bcdd2085"),
      unsplashFallback("1558618666-fcd25c85cd64"),
      unsplashFallback("1517694712202-14b953b2f4f6"),
    ],
    accentColor: "#22C55E",
  },
  {
    slug: "fashion-men",
    nameAr: "أزياء رجالية",
    nameEn: "Men's Fashion",
    descriptionAr: "تقييمات وتجارب مع الملابس الرجالية، الأحذية، الساعات، والعطور الرجالية.",
    bannerImage: unsplash("1507003211169-0a1dd7228f2d", 1200, 600),
    circleImage: unsplashCircle("1507003211169-0a1dd7228f2d"),
    fallbackImages: [
      unsplashFallback("1507003211169-0a1dd7228f2d"),
      unsplashFallback("1617137968427-85924c800a22"),
      unsplashFallback("1524592094714-0f0654e20314"),
      unsplashFallback("1542291026-7eec264c27ff"),
    ],
    accentColor: "#1E293B",
  },
  {
    slug: "fashion-women",
    nameAr: "أزياء نسائية",
    nameEn: "Women's Fashion",
    descriptionAr: "تجارب البنات مع العبايات، الفساتين، الشنط، الأحذية، والإطلالات اليومية.",
    bannerImage: unsplash("1512496015851-a90fb38ba796", 1200, 600),
    circleImage: unsplashCircle("1512496015851-a90fb38ba796"),
    fallbackImages: [
      unsplashFallback("1512496015851-a90fb38ba796"),
      unsplashFallback("1581044777559-4c0e0c9f0f3c"),
      unsplashFallback("1595777457583-95e059d581b8"),
      unsplashFallback("1584917865442-de89df76afd3"),
      unsplashFallback("1542291026-7eec264c27ff"),
    ],
    accentColor: "#D946EF",
  },
  {
    slug: "baby",
    nameAr: "أطفال رضع",
    nameEn: "Baby & Infants",
    descriptionAr: "تجارب الأمهات مع مستلزمات الرضع، العناية، الرضاعة، والتنقل.",
    bannerImage: unsplash("1519689680058-324335c87abb", 1200, 600),
    circleImage: unsplashCircle("1519689680058-324335c87abb"),
    fallbackImages: [
      unsplashFallback("1519689680058-324335c87abb"),
      unsplashFallback("1521130170893-30e12e1a4487"),
      unsplashFallback("1519681390784-0c3eb9f2f75e"),
    ],
    accentColor: "#F8FAFC",
  },
  {
    slug: "toys",
    nameAr: "ألعاب",
    nameEn: "Toys & Games",
    descriptionAr: "تقييمات وتجارب مع ألعاب الأطفال، الألعاب التعليمية، والهدايا المناسبة.",
    bannerImage: unsplash("1558618666-fcd25c85cd64", 1200, 600),
    circleImage: unsplashCircle("1558618666-fcd25c85cd64"),
    fallbackImages: [
      unsplashFallback("1558618666-fcd25c85cd64"),
      unsplashFallback("1560885537917-9e71c69da31e"),
      unsplashFallback("1612499104998-95f2b55c5c0b"),
      unsplashFallback("1559651545-5f8d3a0c6c09"),
    ],
    accentColor: "#FACC15",
  },
  {
    slug: "fashion-kids",
    nameAr: "أزياء أطفال",
    nameEn: "Kids Fashion",
    descriptionAr: "تجارب الأمهات مع ملابس الأطفال، الأحذية، والاختيارات اليومية.",
    bannerImage: unsplash("1546435770-a3e426bf472b", 1200, 600),
    circleImage: unsplashCircle("1546435770-a3e426bf472b"),
    fallbackImages: [
      unsplashFallback("1546435770-a3e426bf472b"),
      unsplashFallback("1515488042361-ee00e0ddd4e4"),
      unsplashFallback("1519689680058-324335c87abb"),
    ],
    accentColor: "#FB923C",
  },
  {
    slug: "sports",
    nameAr: "رياضة وخارج المنزل",
    nameEn: "Sports & Outdoors",
    descriptionAr: "تجارب المستخدمين مع الأدوات الرياضية، الأحذية، الإكسسوارات، ومنتجات النشاط الخارجي.",
    bannerImage: unsplash("1461896836934-bd45ba8fcf9b", 1200, 600),
    circleImage: unsplashCircle("1461896836934-bd45ba8fcf9b"),
    fallbackImages: [
      unsplashFallback("1461896836934-bd45ba8fcf9b"),
      unsplashFallback("1552674460-24f9a21b1e6c"),
      unsplashFallback("1544367567-0f2fcb009e0b"),
      unsplashFallback("1519500528352-78dcf7b402b0"),
    ],
    accentColor: "#22C55E",
  },
  {
    slug: "health",
    nameAr: "صحة وتغذية",
    nameEn: "Health & Nutrition",
    descriptionAr: "آراء المستخدمين حول منتجات الصحة، التغذية، العناية، والروتين اليومي.",
    bannerImage: unsplash("1544367567-0f2fcb009e0b", 1200, 600),
    circleImage: unsplashCircle("1544367567-0f2fcb009e0b"),
    fallbackImages: [
      unsplashFallback("1544367567-0f2fcb009e0b"),
      unsplashFallback("1559839736-88254bf77f3f"),
      unsplashFallback("1614992005069-9f11c8f32c1f"),
      unsplashFallback("1504674900247-0877df9cc836"),
    ],
    accentColor: "#10B981",
  },
  {
    slug: "stationery",
    nameAr: "قرطاسية",
    nameEn: "Stationery",
    descriptionAr: "تجارب مع الدفاتر، الأقلام، الأدوات المكتبية، ومنتجات الدراسة والعمل.",
    bannerImage: unsplash("1456739624468-2a89634a2ae8", 1200, 600),
    circleImage: unsplashCircle("1456739624468-2a89634a2ae8"),
    fallbackImages: [
      unsplashFallback("1456739624468-2a89634a2ae8"),
      unsplashFallback("1495446815901-a7297e633e8d"),
      unsplashFallback("1513475382585-d6e0c0b6e4a1"),
    ],
    accentColor: "#3B82F6",
  },
  {
    slug: "books",
    nameAr: "كتب وإعلام",
    nameEn: "Books & Media",
    descriptionAr: "تقييمات وتجارب حول الكتب، المجلات، المواد التعليمية، والمحتوى الإعلامي.",
    bannerImage: unsplash("1495446815901-a7297e633e8d", 1200, 600),
    circleImage: unsplashCircle("1495446815901-a7297e633e8d"),
    fallbackImages: [
      unsplashFallback("1495446815901-a7297e633e8d"),
      unsplashFallback("1456739624468-2a89634a2ae8"),
      unsplashFallback("1524995997946-a11871a2c9ca"),
    ],
    accentColor: "#8B5CF6",
  },
  {
    slug: "automotive",
    nameAr: "سيارات",
    nameEn: "Automotive",
    descriptionAr: "تجارب المستخدمين مع إكسسوارات السيارات، العناية، والتنظيم داخل السيارة.",
    bannerImage: unsplash("1449965408659-2f64b6b1a1d2", 1200, 600),
    circleImage: unsplashCircle("1449965408659-2f64b6b1a1d2"),
    fallbackImages: [
      unsplashFallback("1449965408659-2f64b6b1a1d2"),
      unsplashFallback("1493238792000-8113da705763"),
      unsplashFallback("1553440569-91daf5b9b003"),
    ],
    accentColor: "#64748B",
  },
];

const visualMap = new Map<string, CategoryVisual>(
  CATEGORY_VISUALS.map((v) => [v.slug, v]),
);

const arNameMap = new Map<string, CategoryVisual>(
  CATEGORY_VISUALS.map((v) => [v.nameAr, v]),
);

const slugVariants: Record<string, string> = {
  "home-kitchen": "home",
  "home-and-kitchen": "home",
  food: "grocery",
  grocery: "grocery",
  "fashion-men": "fashion-men",
  "men-fashion": "fashion-men",
  "fashion-women": "fashion-women",
  "women-fashion": "fashion-women",
  baby: "baby",
  infants: "baby",
  kids: "fashion-kids",
  "fashion-kids": "fashion-kids",
  toys: "toys",
  "kids-toys": "toys",
  sports: "sports",
  fitness: "sports",
  health: "health",
  nutrition: "health",
  stationery: "stationery",
  office: "stationery",
  books: "books",
  media: "books",
  automotive: "automotive",
  car: "automotive",
  electronics: "electronics",
  beauty: "beauty",
  fragrance: "beauty",
};

function resolveSlug(input: string): string {
  const normalized = input.toLowerCase().trim();
  if (visualMap.has(normalized)) return normalized;
  if (arNameMap.has(normalized)) {
    const found = arNameMap.get(normalized);
    return found?.slug ?? normalized;
  }
  return slugVariants[normalized] ?? normalized;
}

export function getCategoryVisual(
  slugOrName: string,
): CategoryVisual | undefined {
  const resolved = resolveSlug(slugOrName);
  return visualMap.get(resolved);
}

export function getCategoryBanner(slugOrName: string): string {
  return getCategoryVisual(slugOrName)?.bannerImage ?? DEFAULT_BANNER;
}

export function getCategoryCircleImage(slugOrName: string): string {
  return getCategoryVisual(slugOrName)?.circleImage ?? DEFAULT_CIRCLE;
}

export function getCategoryFallbackImage(
  slugOrName: string,
  index = 0,
): string {
  const visual = getCategoryVisual(slugOrName);
  if (visual && visual.fallbackImages.length > 0) {
    return visual.fallbackImages[index % visual.fallbackImages.length] ?? DEFAULT_IMAGE;
  }
  return DEFAULT_IMAGE;
}

export function getCategoryAccentColor(slugOrName: string): string {
  return getCategoryVisual(slugOrName)?.accentColor ?? "#FFCE00";
}

export function getCategoryDescription(slugOrName: string): string {
  return getCategoryVisual(slugOrName)?.descriptionAr ?? "";
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1585381299351-7a5e29ca6f8d?w=400&h=400&fit=crop&q=80";
const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1585381299351-7a5e29ca6f8d?w=1200&h=600&fit=crop&q=80";
const DEFAULT_CIRCLE =
  "https://images.unsplash.com/photo-1585381299351-7a5e29ca6f8d?w=200&h=200&fit=crop&q=80";

export function safeCategoryImage(
  slugOrName: string | null | undefined,
  apiUrl: string | null | undefined,
  index = 0,
): string {
  if (apiUrl && typeof apiUrl === "string" && apiUrl.length > 0 && apiUrl !== "/image") {
    return apiUrl;
  }
  if (slugOrName) {
    return getCategoryFallbackImage(slugOrName, index);
  }
  return DEFAULT_IMAGE;
}