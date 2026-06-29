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

export interface DemoProduct {
  id: string;
  nameAr: string;
  summaryAr: string;
  priceMin: number;
  priceMax: number;
  ratingAverage: number;
  media: { url: string; altAr: string }[];
  brand: { name: string; slug: string } | null;
  category: { nameAr: string; slug: string };
}

export interface DemoPost {
  id: string;
  title: string;
  body: string;
  rating: number;
  media: { url: string; altAr: string }[];
  author: {
    profile: {
      displayName: string;
      avatarUrl: string | null;
    };
  };
  product: {
    nameAr: string;
    brand: { name: string; slug: string } | null;
    category: { nameAr: string; slug: string };
    media: { url: string; altAr: string }[];
  };
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

const urlSlugToVisualSlug: Record<string, string> = {
  electronics: "electronics",
  beauty: "beauty",
  home: "home",
  "home-kitchen": "home",
  grocery: "grocery",
  food: "grocery",
  "men-fashion": "fashion-men",
  "fashion-men": "fashion-men",
  "women-fashion": "fashion-women",
  "fashion-women": "fashion-women",
  baby: "baby",
  infants: "baby",
  toys: "toys",
  "kids-toys": "toys",
  "kids-fashion": "fashion-kids",
  "fashion-kids": "fashion-kids",
  kids: "baby",
  fashion: "fashion-women",
  sports: "sports",
  "sports-outdoors": "sports",
  health: "health",
  "health-nutrition": "health",
  nutrition: "health",
  stationery: "stationery",
  office: "stationery",
  books: "books",
  "books-media": "books",
  media: "books",
  automotive: "automotive",
  cars: "automotive",
  car: "automotive",
};

export type UrlSlug = keyof typeof urlSlugToVisualSlug;

export function resolveUrlSlug(urlSlug: string): string {
  const normalized = urlSlug.toLowerCase().trim();
  return urlSlugToVisualSlug[normalized] ?? normalized;
}

export function getCategoryVisual(
  slugOrName: string,
): CategoryVisual | undefined {
  const resolved = resolveUrlSlug(slugOrName);
  if (visualMap.has(resolved)) {
    return visualMap.get(resolved);
  }
  return arNameMap.get(slugOrName);
}

export function getVisualByUrlSlug(urlSlug: string): CategoryVisual | undefined {
  const resolved = resolveUrlSlug(urlSlug);
  return visualMap.get(resolved);
}

export function getCategoryBanner(urlSlug: string): string {
  return getVisualByUrlSlug(urlSlug)?.bannerImage ?? DEFAULT_BANNER;
}

export function getCategoryCircleImage(urlSlug: string): string {
  return getVisualByUrlSlug(urlSlug)?.circleImage ?? DEFAULT_CIRCLE;
}

export function getCategoryFallbackImage(
  urlSlug: string,
  index = 0,
): string {
  const visual = getVisualByUrlSlug(urlSlug);
  if (visual && visual.fallbackImages.length > 0) {
    return visual.fallbackImages[index % visual.fallbackImages.length] ?? DEFAULT_IMAGE;
  }
  return DEFAULT_IMAGE;
}

export function getCategoryAccentColor(urlSlug: string): string {
  return getVisualByUrlSlug(urlSlug)?.accentColor ?? "#FFCE00";
}

export function getCategoryDescription(urlSlug: string): string {
  return getVisualByUrlSlug(urlSlug)?.descriptionAr ?? "";
}

export function getCategoryNameAr(urlSlug: string): string {
  return getVisualByUrlSlug(urlSlug)?.nameAr ?? "تصنيف";
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1585381299351-7a5e29ca6f8d?w=400&h=400&fit=crop&q=80";
const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1585381299351-7a5e29ca6f8d?w=1200&h=600&fit=crop&q=80";
const DEFAULT_CIRCLE =
  "https://images.unsplash.com/photo-1585381299351-7a5e29ca6f8d?w=200&h=200&fit=crop&q=80";

export function safeCategoryImage(
  urlSlug: string | null | undefined,
  apiUrl: string | null | undefined,
  index = 0,
): string {
  if (apiUrl && typeof apiUrl === "string" && apiUrl.length > 0 && apiUrl !== "/image") {
    return apiUrl;
  }
  if (urlSlug) {
    return getCategoryFallbackImage(urlSlug, index);
  }
  return DEFAULT_IMAGE;
}

function matchCategory(text: string, categoryNameAr: string): boolean {
  const t = text.toLowerCase().trim();
  const c = categoryNameAr.toLowerCase().trim();
  if (t.includes(c)) return true;
  const keywords: Record<string, string[]> = {
    "إلكترونيات": ["جوال", "سماعة", "لابتوب", "كهربائي", "إلكتروني", "ساعة ذكية", "آيفون", "سامسونج"],
    "جمال وعطور": ["عطر", "مكياج", "كريمس", "بشرة", "شعر", "رائحة", "مزيل", "أحمر شفاه", " FOUNDATION", "سيروم", "مرطب"],
    "منزل ومطبخ": ["مطبخ", "إ子", "قدر", "قلاية", "خلاط", "أداة مطبخ", "منظم", "فرن", "ثلاجة"],
    "بقالة": ["طعام", "قهوة", "شاي", "سكر", "نخالة", "زيت", "حليب", "خبز", "سناك"],
    "أزياء رجالية": ["رجالي", "男人", "بنطلون", "قميص رجالي", "حذاء رجالي"],
    "أزياء نسائية": ["نسائي", "女人", "عباية", "فستان", "شنطة", "حذاء نسائي", "أكسسوار"],
    "أطفال رضع": ["طفل", "رضيع", "baby", "عربة", "رضاعة", "حفاض", "كريم أطفال"],
    "ألعاب": ["لعبة", "toy", "دمي", "مكعب", "تركيب", "ريك", "puzzle"],
    "أزياء أطفال": ["أطفال", "kids", "ملابس أطفال", "حذاء أطفال"],
    "رياضة وخارج المنزل": ["رياضة", "sport", "كرة", "ميدان", "تمرين", "-fit", "سلة", "سباحة"],
    "صحة وتغذية": ["صحة", "غذاء", "فيتامين", "بروتين", " nutritional", " wellness", "علاج", "مكمل"],
    "قرطاسية": ["دفتر", "قلم", "قرطاس", "مكتب", "stationery", "نوت بوك"],
    "كتب وإعلام": ["كتاب", "مجلد", " read", "رمان", "media", "إعلام"],
    "سيارات": ["سيارة", "car", "automotive", "وقود", "زيت", "كفر", "إكسسوار سيارة"],
  };
  const catKeywords = keywords[c];
  if (!catKeywords) return t.includes(c);
  return catKeywords.some((kw) => t.includes(kw.toLowerCase()));
}

export function productMatchesCategory(productNameAr: string, urlSlug: string): boolean {
  const visual = getVisualByUrlSlug(urlSlug);
  if (!visual) return false;
  return matchCategory(productNameAr, visual.nameAr);
}

export function postMatchesCategory(postTitle: string, postBody: string, productNameAr: string, urlSlug: string): boolean {
  const visual = getVisualByUrlSlug(urlSlug);
  if (!visual) return false;
  const text = `${postTitle} ${postBody} ${productNameAr}`;
  return matchCategory(text, visual.nameAr);
}

export const DEMO_PRODUCTS: DemoProduct[] = [
  // Electronics
  { id: "demo-elec-1", nameAr: "سماعات لاسلكية برو", summaryAr: "سماعات بلوتوث بجودة صوت عالية وعمر بطارية طويل", priceMin: 299, priceMax: 499, ratingAverage: 8.5, media: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80", altAr: "سماعات لاسلكية" }], brand: { name: "صوني", slug: "sony" }, category: { nameAr: "إلكترونيات", slug: "electronics" } },
  { id: "demo-elec-2", nameAr: "ساعة ذكية متطورة", summaryAr: "ساعة ذكية مع تتبع اللياقة والقلب ومقاومة الماء", priceMin: 599, priceMax: 899, ratingAverage: 8.2, media: [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80", altAr: "ساعة ذكية" }], brand: { name: "آبل", slug: "apple" }, category: { nameAr: "إلكترونيات", slug: "electronics" } },
  { id: "demo-elec-3", nameAr: "جوال متوسط الفئة", summaryAr: "جوال بكاميرا ممتازة وبطارية كبيرة", priceMin: 999, priceMax: 1499, ratingAverage: 7.8, media: [{ url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&q=80", altAr: "جوال" }], brand: { name: "سامسونج", slug: "samsung" }, category: { nameAr: "إلكترونيات", slug: "electronics" } },

  // Beauty
  { id: "demo-bea-1", nameAr: "عطر نسائي ناعم", summaryAr: "عطر بمكونات طبيعية，沉香万里香氛", priceMin: 199, priceMax: 399, ratingAverage: 8.7, media: [{ url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&q=80", altAr: "عطر" }], brand: { name: "ديور", slug: "dior" }, category: { nameAr: "جمال وعطور", slug: "beauty" } },
  { id: "demo-bea-2", nameAr: "سيروم فيتامين سي", summaryAr: "سيروم لتفتيح البشرة وتقليل التجاعيد", priceMin: 149, priceMax: 249, ratingAverage: 8.3, media: [{ url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&q=80", altAr: "سيروم" }], brand: { name: " ذا أورديناري", slug: "theordinary" }, category: { nameAr: "جمال وعطور", slug: "beauty" } },
  { id: "demo-bea-3", nameAr: "مرطب للبشرة الجافة", summaryAr: "مرطب بترطيب عميق للبشرة الحساسة", priceMin: 99, priceMax: 199, ratingAverage: 8.0, media: [{ url: "https://images.unsplash.com/photo-1570194065650-d99fb4b38e16?w=400&h=400&fit=crop&q=80", altAr: "مرطب" }], brand: { name: "لاروش بوزاي", slug: "larocheposay" }, category: { nameAr: "جمال وعطور", slug: "beauty" } },

  // Home & Kitchen
  { id: "demo-hom-1", nameAr: "قلاية هوائية متعددة الاستخدامات", summaryAr: "قلاية هوائية بسعة 5 لتر مع تحكم رقمي", priceMin: 399, priceMax: 699, ratingAverage: 8.4, media: [{ url: "https://images.unsplash.com/photo-1574269906582-6f61d7a8b3f1?w=400&h=400&fit=crop&q=80", altAr: "قلاية هوائية" }], brand: { name: "فيليبس", slug: "philips" }, category: { nameAr: "منزل ومطبخ", slug: "home" } },
  { id: "demo-hom-2", nameAr: "خلاط كهربائي احترافي", summaryAr: "خلاط بسرعة عالية مع وعاء زجاجي كبير", priceMin: 299, priceMax: 499, ratingAverage: 8.1, media: [{ url: "https://images.unsplash.com/photo-1574269906582-6f61d7a8b3f1?w=400&h=400&fit=crop&q=80", altAr: "خلاط" }], brand: { name: " Oster", slug: "oster" }, category: { nameAr: "منزل ومطبخ", slug: "home" } },
  { id: "demo-hom-3", nameAr: "منظم مطبخ عملي", summaryAr: "منظم لأدوات المطبخ مع رفوف قابلة للتعديل", priceMin: 149, priceMax: 299, ratingAverage: 7.9, media: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80", altAr: "منظم مطبخ" }], brand: null, category: { nameAr: "منزل ومطبخ", slug: "home" } },

  // Grocery
  { id: "demo-grc-1", nameAr: "قهوة عربية مختصة", summaryAr: "قهوة عربية محمصة بعناية من أفضل المحامص", priceMin: 59, priceMax: 129, ratingAverage: 8.6, media: [{ url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&q=80", altAr: "قهوة" }], brand: { name: " محمصة القمة", slug: "qimah" }, category: { nameAr: "بقالة", slug: "grocery" } },
  { id: "demo-grc-2", nameAr: "زعفران فارسي الأصلي", summaryAr: "زعفران إيراني عالي الجودة للطبخ والمشروبات", priceMin: 89, priceMax: 199, ratingAverage: 9.0, media: [{ url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=80", altAr: "زعفران" }], brand: null, category: { nameAr: "بقالة", slug: "grocery" } },
  { id: "demo-grc-3", nameAr: "شاي أخضر طبيعي", summaryAr: "شاي أخضر صيني بجودة عالية", priceMin: 39, priceMax: 89, ratingAverage: 8.2, media: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80", altAr: "شاي" }], brand: { name: "ليبنج", slug: "liping" }, category: { nameAr: "بقالة", slug: "grocery" } },

  // Fashion Men
  { id: "demo-men-1", nameAr: "عطر رجالي فاخر", summaryAr: "عطر برائحة خشبية طويلة الأمد", priceMin: 299, priceMax: 499, ratingAverage: 8.5, media: [{ url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop&q=80", altAr: "عطر رجالي" }], brand: { name: "ديور", slug: "dior" }, category: { nameAr: "أزياء رجالية", slug: "fashion-men" } },
  { id: "demo-men-2", nameAr: "حذاء رياضي كلاسيكي", summaryAr: "حذاء رياضي مريح للاستخدام اليومي", priceMin: 299, priceMax: 499, ratingAverage: 8.0, media: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&q=80", altAr: "حذاء رياضي" }], brand: { name: "نايك", slug: "nike" }, category: { nameAr: "أزياء رجالية", slug: "fashion-men" } },
  { id: "demo-men-3", nameAr: "ساعة يد كلاسيكية", summaryAr: "ساعة يد بتصميم أنيق للرجال", priceMin: 499, priceMax: 999, ratingAverage: 8.3, media: [{ url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop&q=80", altAr: "ساعة" }], brand: { name: "كاسيو", slug: "casio" }, category: { nameAr: "أزياء رجالية", slug: "fashion-men" } },

  // Fashion Women
  { id: "demo-wom-1", nameAr: "عباية مطرزة فاخرة", summaryAr: "عباية سوداء بالت-broiderie فاخرة", priceMin: 499, priceMax: 899, ratingAverage: 8.8, media: [{ url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&q=80", altAr: "عباية" }], brand: null, category: { nameAr: "أزياء نسائية", slug: "fashion-women" } },
  { id: "demo-wom-2", nameAr: "فستان سهرة أنيق", summaryAr: "فستان طويل للمناسبات الخاصة", priceMin: 399, priceMax: 699, ratingAverage: 8.4, media: [{ url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&q=80", altAr: "فستان" }], brand: null, category: { nameAr: "أزياء نسائية", slug: "fashion-women" } },
  { id: "demo-wom-3", nameAr: "شنطة يد عصرية", summaryAr: "شنطة يد من الجلد الطبيعي", priceMin: 299, priceMax: 599, ratingAverage: 8.2, media: [{ url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&q=80", altAr: "شنطة" }], brand: { name: " ماي", slug: "mk" }, category: { nameAr: "أزياء نسائية", slug: "fashion-women" } },

  // Baby
  { id: "demo-bab-1", nameAr: "عربة أطفال خفيفة", summaryAr: "عربة أطفال قابلة للطي وخفيفة الوزن", priceMin: 699, priceMax: 1199, ratingAverage: 8.6, media: [{ url: "https://images.unsplash.com/photo-1519689680058-324335c87abb?w=400&h=400&fit=crop&q=80", altAr: "عربة أطفال" }], brand: { name: "ماكيتا", slug: "maclaren" }, category: { nameAr: "أطفال رضع", slug: "baby" } },
  { id: "demo-bab-2", nameAr: "رضاعة مضادة للمغص", summaryAr: "رضاعة بتصميم مانع للمغص والغازات", priceMin: 99, priceMax: 199, ratingAverage: 8.3, media: [{ url: "https://images.unsplash.com/photo-1519689680058-324335c87abb?w=400&h=400&fit=crop&q=80", altAr: "رضاعة" }], brand: { name: "ميديلا", slug: "medela" }, category: { nameAr: "أطفال رضع", slug: "baby" } },
  { id: "demo-bab-3", nameAr: "كريم عناية للأطفال", summaryAr: "كريم مرطب للبشرة الحساسة للأطفال", priceMin: 69, priceMax: 129, ratingAverage: 8.0, media: [{ url: "https://images.unsplash.com/photo-1519689680058-324335c87abb?w=400&h=400&fit=crop&q=80", altAr: "كريم أطفال" }], brand: { name: "موستيلا", slug: "mustela" }, category: { nameAr: "أطفال رضع", slug: "baby" } },

  // Toys
  { id: "demo-toy-1", nameAr: "مكعبات تعليمية للأطفال", summaryAr: "مكعبات ملونة للتعلم واللعب", priceMin: 99, priceMax: 199, ratingAverage: 8.5, media: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80", altAr: "مكعبات" }], brand: null, category: { nameAr: "ألعاب", slug: "toys" } },
  { id: "demo-toy-2", nameAr: "دمية ناعمة للأطفال", summaryAr: "دمية قماش ناعمة وآمنة للأطفال", priceMin: 79, priceMax: 149, ratingAverage: 8.2, media: [{ url: "https://images.unsplash.com/photo-1559651545-5f8d3a0c6c09?w=400&h=400&fit=crop&q=80", altAr: "دمية" }], brand: null, category: { nameAr: "ألعاب", slug: "toys" } },
  { id: "demo-toy-3", nameAr: "لعبة تركيب للأطفال", summaryAr: "قطار بناء للتعلم والابتكار", priceMin: 129, priceMax: 249, ratingAverage: 8.4, media: [{ url: "https://images.unsplash.com/photo-1560885537917-9e71c69da31e?w=400&h=400&fit=crop&q=80", altAr: "لعبة تركيب" }], brand: { name: "ليغو", slug: "lego" }, category: { nameAr: "ألعاب", slug: "toys" } },

  // Kids Fashion
  { id: "demo-kid-1", nameAr: "ملابس أطفال عصرية", summaryAr: "طقم ملابس للأطفال بألوان جذابة", priceMin: 129, priceMax: 249, ratingAverage: 8.0, media: [{ url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop&q=80", altAr: "ملابس أطفال" }], brand: null, category: { nameAr: "أزياء أطفال", slug: "fashion-kids" } },
  { id: "demo-kid-2", nameAr: "حذاء أطفال مريح", summaryAr: "حذاء خفيف ومريح للطفل", priceMin: 149, priceMax: 249, ratingAverage: 8.1, media: [{ url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&q=80", altAr: "حذاء أطفال" }], brand: { name: "نايك", slug: "nike" }, category: { nameAr: "أزياء أطفال", slug: "fashion-kids" } },
  { id: "demo-kid-3", nameAr: "فستان أطفال جميل", summaryAr: "فستان للأ的女孩 parfait pour les petites filles", priceMin: 119, priceMax: 219, ratingAverage: 8.3, media: [{ url: "https://images.unsplash.com/photo-1519689680058-324335c87abb?w=400&h=400&fit=crop&q=80", altAr: "فستان أطفال" }], brand: null, category: { nameAr: "أزياء أطفال", slug: "fashion-kids" } },

  // Sports
  { id: "demo-spt-1", nameAr: "حذاء رياضي للرجال", summaryAr: "حذاء جري خفيف ومقاوم للماء", priceMin: 399, priceMax: 699, ratingAverage: 8.5, media: [{ url: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=400&h=400&fit=crop&q=80", altAr: "حذاء رياضي" }], brand: { name: "نايك", slug: "nike" }, category: { nameAr: "رياضة وخارج المنزل", slug: "sports" } },
  { id: "demo-spt-2", nameAr: "شنطة رياضية", summaryAr: "شنطة للرياضة مع حجرات متعددة", priceMin: 199, priceMax: 399, ratingAverage: 8.0, media: [{ url: "https://images.unsplash.com/photo-1552674460-24f9a21b1e6c?w=400&h=400&fit=crop&q=80", altAr: "شنطة رياضية" }], brand: { name: "أديداس", slug: "adidas" }, category: { nameAr: "رياضة وخارج المنزل", slug: "sports" } },
  { id: "demo-spt-3", nameAr: "معدات تمارين منزلية", summaryAr: "حبل قفز وديمات مطاطية للتمارين", priceMin: 99, priceMax: 199, ratingAverage: 7.9, media: [{ url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&q=80", altAr: "معدات رياضية" }], brand: null, category: { nameAr: "رياضة وخارج المنزل", slug: "sports" } },

  // Health
  { id: "demo-hlt-1", nameAr: "فيتامينات متعددة", summaryAr: "مكمل غذائي بالفيتامينات والمعادن", priceMin: 99, priceMax: 199, ratingAverage: 8.2, media: [{ url: "https://images.unsplash.com/photo-1559839736-88254bf77f3f?w=400&h=400&fit=crop&q=80", altAr: "فيتامينات" }], brand: { name: "سنتروم", slug: "centrum" }, category: { nameAr: "صحة وتغذية", slug: "health" } },
  { id: "demo-hlt-2", nameAr: "بروتين واقي", summaryAr: "بروتين للجيم لبناء العضلات", priceMin: 199, priceMax: 399, ratingAverage: 8.4, media: [{ url: "https://images.unsplash.com/photo-1614992005069-9f11c8f32c1f?w=400&h=400&fit=crop&q=80", altAr: "بروتين" }], brand: { name: "غولد ستاندرد", slug: "goldstandard" }, category: { nameAr: "صحة وتغذية", slug: "health" } },
  { id: "demo-hlt-3", nameAr: "زيت زيتون بكر", summaryAr: "زيت زيتون طبيعي بكر للتصحيح", priceMin: 79, priceMax: 159, ratingAverage: 8.7, media: [{ url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=80", altAr: "زيت زيتون" }], brand: null, category: { nameAr: "صحة وتغذية", slug: "health" } },

  // Stationery
  { id: "demo-sta-1", nameAr: "دفتر ملاحظات فاخر", summaryAr: "دفتر بجودة عالية للكتابة والدراسة", priceMin: 29, priceMax: 59, ratingAverage: 8.0, media: [{ url: "https://images.unsplash.com/photo-1456739624468-2a89634a2ae8?w=400&h=400&fit=crop&q=80", altAr: "دفتر" }], brand: { name: "مولسين", slug: "moleskine" }, category: { nameAr: "قرطاسية", slug: "stationery" } },
  { id: "demo-sta-2", nameAr: "قلم جاف احترافي", summaryAr: "قلم جاف سلس للكتابة اليومية", priceMin: 15, priceMax: 39, ratingAverage: 7.8, media: [{ url: "https://images.unsplash.com/photo-1513475382585-d6e0c0b6e4a1?w=400&h=400&fit=crop&q=80", altAr: "قلم" }], brand: { name: "بيلي", slug: "billy" }, category: { nameAr: "قرطاسية", slug: "stationery" } },
  { id: "demo-sta-3", nameAr: "ستيشنري أبيض", summaryAr: "طقم أدوات مكتبية أنيق", priceMin: 49, priceMax: 99, ratingAverage: 8.1, media: [{ url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop&q=80", altAr: "ستيشنري" }], brand: null, category: { nameAr: "قرطاسية", slug: "stationery" } },

  // Books
  { id: "demo-bks-1", nameAr: "رواية مشهورة", summaryAr: "رواية من أفضلseller الكاتب", priceMin: 59, priceMax: 99, ratingAverage: 8.6, media: [{ url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop&q=80", altAr: "كتاب" }], brand: null, category: { nameAr: "كتب وإعلام", slug: "books" } },
  { id: "demo-bks-2", nameAr: "كتاب تطوير الذات", summaryAr: "كتاب عن النجاح والتحفيز", priceMin: 49, priceMax: 89, ratingAverage: 8.3, media: [{ url: "https://images.unsplash.com/photo-1456739624468-2a89634a2ae8?w=400&h=400&fit=crop&q=80", altAr: "كتاب" }], brand: null, category: { nameAr: "كتب وإعلام", slug: "books" } },
  { id: "demo-bks-3", nameAr: "مجلة أسبوعية", summaryAr: "مجلة ثقافية فنية", priceMin: 19, priceMax: 39, ratingAverage: 7.5, media: [{ url: "https://images.unsplash.com/photo-1524995997946-a11871a2c9ca?w=400&h=400&fit=crop&q=80", altAr: "مجلة" }], brand: null, category: { nameAr: "كتب وإعلام", slug: "books" } },

  // Automotive
  { id: "demo-aut-1", nameAr: "مكيف هواء محمول للسيارة", summaryAr: "مكيف صغير للسيارة يعمل بال USB", priceMin: 199, priceMax: 399, ratingAverage: 8.0, media: [{ url: "https://images.unsplash.com/photo-1449965408659-2f64b6b1a1d2?w=400&h=400&fit=crop&q=80", altAr: "مكيف سيارة" }], brand: null, category: { nameAr: "سيارات", slug: "automotive" } },
  { id: "demo-aut-2", nameAr: "منظم مقعد سيارة", summaryAr: "منظم للأجهزة والأشياء تحت المقعد", priceMin: 79, priceMax: 149, ratingAverage: 7.8, media: [{ url: "https://images.unsplash.com/photo-1553440569-91daf5b9b003?w=400&h=400&fit=crop&q=80", altAr: "منظم سيارة" }], brand: null, category: { nameAr: "سيارات", slug: "automotive" } },
  { id: "demo-aut-3", nameAr: "رذاذ تعطير السيارة", summaryAr: "معطر جو برائحة منعشة للسيارة", priceMin: 39, priceMax: 79, ratingAverage: 8.1, media: [{ url: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&h=400&fit=crop&q=80", altAr: "معطر سيارة" }], brand: { name: "يوكي", slug: "yankee" }, category: { nameAr: "سيارات", slug: "automotive" } },
];

export const DEMO_POSTS: DemoPost[] = [
  // Electronics
  { id: "demo-post-elec-1", title: "تجربتي مع سماعات سوني اللاسلكية", body: "سماعات ممتازة صوت واضح وبطارية تدوم ساعات. مناسبة للرياضة والترفيه.", rating: 8.5, media: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80", altAr: "سماعات" }], author: { profile: { displayName: "أحمد", avatarUrl: null } }, product: { nameAr: "سماعات لاسلكية برو", brand: { name: "صوني", slug: "sony" }, category: { nameAr: "إلكترونيات", slug: "electronics" }, media: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80", altAr: "سماعات" }] } },
  { id: "demo-post-elec-2", title: "ساعة آبل الذكية - تقييم صريح", body: "ساعة ذكية مريحة وتتبع اللياقة بشكل ممتاز. عمر البطارية مقبول.", rating: 8.2, media: [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80", altAr: "ساعة" }], author: { profile: { displayName: "محمد", avatarUrl: null } }, product: { nameAr: "ساعة ذكية متطورة", brand: { name: "آبل", slug: "apple" }, category: { nameAr: "إلكترونيات", slug: "electronics" }, media: [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80", altAr: "ساعة" }] } },

  // Beauty
  { id: "demo-post-bea-1", title: "عطر ديوور - رائحة تدوم طوال اليوم", body: "عطر فاخر برائحة زهربية خشبية. ثابت جداً ويستمر لعدة ساعات.", rating: 9.0, media: [{ url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&q=80", altAr: "عطر" }], author: { profile: { displayName: "سارة", avatarUrl: null } }, product: { nameAr: "عطر نسائي ناعم", brand: { name: "ديور", slug: "dior" }, category: { nameAr: "جمال وعطور", slug: "beauty" }, media: [{ url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&q=80", altAr: "عطر" }] } },
  { id: "demo-post-bea-2", title: "سيروم فيتامين سي - بشرتي صارت أفضل", body: "استخدمت السيروم لمدة شهر والنتيجة واضحة. البشرة أصبحت أفتح وأكثر إشراقاً.", rating: 8.5, media: [{ url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&q=80", altAr: "سيروم" }], author: { profile: { displayName: "نورة", avatarUrl: null } }, product: { nameAr: "سيروم فيتامين سي", brand: { name: "ذا أورديناري", slug: "theordinary" }, category: { nameAr: "جمال وعطور", slug: "beauty" }, media: [{ url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&q=80", altAr: "سيروم" }] } },

  // Home
  { id: "demo-post-hom-1", title: "القلاية الهوائية - وجبات صحية بدون زيت", body: "صراحة القلاية الهوائية غيّرت طريقة طبخنا. وجبات مقرمشة بدون زيت!", rating: 8.7, media: [{ url: "https://images.unsplash.com/photo-1574269906582-6f61d7a8b3f1?w=400&h=400&fit=crop&q=80", altAr: "قلاية" }], author: { profile: { displayName: "فاطمة", avatarUrl: null } }, product: { nameAr: "قلاية هوائية متعددة الاستخدامات", brand: { name: "فيليبس", slug: "philips" }, category: { nameAr: "منزل ومطبخ", slug: "home" }, media: [{ url: "https://images.unsplash.com/photo-1574269906582-6f61d7a8b3f1?w=400&h=400&fit=crop&q=80", altAr: "قلاية" }] } },

  // Baby
  { id: "demo-post-bab-1", title: "عربة ماكLaren - خفيفة ومتكاملة", body: "عربة ممتازة تنطوي بسهولة وخفيفة جداً. مناسبة للسفر والتنقل اليومي.", rating: 8.8, media: [{ url: "https://images.unsplash.com/photo-1519689680058-324335c87abb?w=400&h=400&fit=crop&q=80", altAr: "عربة" }], author: { profile: { displayName: "هند", avatarUrl: null } }, product: { nameAr: "عربة أطفال خفيفة", brand: { name: "ماكيتا", slug: "maclaren" }, category: { nameAr: "أطفال رضع", slug: "baby" }, media: [{ url: "https://images.unsplash.com/photo-1519689680058-324335c87abb?w=400&h=400&fit=crop&q=80", altAr: "عربة" }] } },

  // Toys
  { id: "demo-post-toy-1", title: "مكعبات ليغو - إبداعchildren", body: "ابني يحب المكعبات ويستمتع بالبناء. تعليمية ومسلية.", rating: 8.6, media: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80", altAr: "مكعبات" }], author: { profile: { displayName: "منى", avatarUrl: null } }, product: { nameAr: "مكعبات تعليمية للأطفال", brand: null, category: { nameAr: "ألعاب", slug: "toys" }, media: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80", altAr: "مكعبات" }] } },

  // Fashion Women
  { id: "demo-post-wom-1", title: "العباية المطرزة - أناقة بالفخامة", body: "عباية فاخرة التطريز دقيق جداً. مناسبة للمناسبات والخروجات.", rating: 8.9, media: [{ url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&q=80", altAr: "عباية" }], author: { profile: { displayName: "لمى", avatarUrl: null } }, product: { nameAr: "عباية مطرزة فاخرة", brand: null, category: { nameAr: "أزياء نسائية", slug: "fashion-women" }, media: [{ url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&q=80", altAr: "عباية" }] } },

  // Sports
  { id: "demo-post-spt-1", title: "حذاء نايك للجري - مريح جداً", body: "حذاء خفيف ومريح لل跑步. مناسب للمبتدئين والمحترفين.", rating: 8.5, media: [{ url: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=400&h=400&fit=crop&q=80", altAr: "حذاء" }], author: { profile: { displayName: "عبدالله", avatarUrl: null } }, product: { nameAr: "حذاء رياضي للرجال", brand: { name: "نايك", slug: "nike" }, category: { nameAr: "رياضة وخارج المنزل", slug: "sports" }, media: [{ url: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=400&h=400&fit=crop&q=80", altAr: "حذاء" }] } },

  // Health
  { id: "demo-post-hlt-1", title: "فيتامينات سنتروم - طاقة يومية", body: "أخذ الفيتامينات بانتظام وأحس بفرق في الطاقة والتركيز.", rating: 8.3, media: [{ url: "https://images.unsplash.com/photo-1559839736-88254bf77f3f?w=400&h=400&fit=crop&q=80", altAr: "فيتامينات" }], author: { profile: { displayName: "خالد", avatarUrl: null } }, product: { nameAr: "فيتامينات متعددة", brand: { name: "سنتروم", slug: "centrum" }, category: { nameAr: "صحة وتغذية", slug: "health" }, media: [{ url: "https://images.unsplash.com/photo-1559839736-88254bf77f3f?w=400&h=400&fit=crop&q=80", altAr: "فيتامينات" }] } },
];

export function getDemoProductsForCategory(urlSlug: string): DemoProduct[] {
  const resolved = resolveUrlSlug(urlSlug);
  return DEMO_PRODUCTS.filter((p) => {
    const visual = getVisualByUrlSlug(resolved);
    if (!visual) return false;
    return matchCategory(p.nameAr, visual.nameAr) || p.category.slug === resolved;
  });
}

export function getDemoPostsForCategory(urlSlug: string): DemoPost[] {
  const resolved = resolveUrlSlug(urlSlug);
  return DEMO_POSTS.filter((p) => {
    const visual = getVisualByUrlSlug(resolved);
    if (!visual) return false;
    return matchCategory(p.product.nameAr, visual.nameAr) || p.product.category.slug === resolved;
  });
}