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
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

export const navCategories: NavCategory[] = [
  { slug: "electronics", nameAr: "إلكترونيات", href: "/categories/electronics" },
  { slug: "beauty", nameAr: "جمال وعطور", href: "/categories/beauty" },
  { slug: "home-kitchen", nameAr: "منزل ومطبخ", href: "/categories/home" },
  { slug: "grocery", nameAr: "بقالة", href: "/categories/food" },
  { slug: "fashion-men", nameAr: "أزياء رجالية", href: "/categories/fashion" },
  { slug: "fashion-women", nameAr: "أزياء نسائية", href: "/categories/fashion" },
  { slug: "baby", nameAr: "أطفال رضع", href: "/categories/kids" },
  { slug: "toys", nameAr: "ألعاب", href: "/categories/kids" },
  { slug: "fashion-kids", nameAr: "أزياء أطفال", href: "/categories/kids" },
  { slug: "sports", nameAr: "رياضة وخارج المنزل", href: "/categories/sports" },
  { slug: "health", nameAr: "صحة وتغذية", href: "/categories/sports" },
  { slug: "stationery", nameAr: "قرطاسية", href: "/categories/books" },
  { slug: "books", nameAr: "كتب وإعلام", href: "/categories/books" },
  { slug: "automotive", nameAr: "سيارات", href: "/categories/electronics" }
];

export const discoveryCircles: DiscoveryCircle[] = [
  {
    id: "trending",
    nameAr: "عروض وتجارب رائجة",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop&q=80",
    href: "/posts"
  },
  {
    id: "perfumes",
    nameAr: "عطور نسائية",
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop&q=80",
    href: "/categories/beauty"
  },
  {
    id: "makeup",
    nameAr: "مكياج",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&q=80",
    href: "/categories/beauty"
  },
  {
    id: "skincare",
    nameAr: "عناية بالبشرة",
    imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4a38e8d?w=200&h=200&fit=crop&q=80",
    href: "/categories/beauty"
  },
  {
    id: "haircare",
    nameAr: "عناية بالشعر",
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=200&h=200&fit=crop&q=80",
    href: "/categories/beauty"
  },
  {
    id: "bags",
    nameAr: "شنط",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop&q=80",
    href: "/categories/fashion"
  },
  {
    id: "shoes",
    nameAr: "أحذية",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop&q=80",
    href: "/categories/fashion"
  },
  {
    id: "sunglasses",
    nameAr: "نظارات",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop&q=80",
    href: "/categories/fashion"
  },
  {
    id: "accessories",
    nameAr: "إكسسوارات",
    imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=200&h=200&fit=crop&q=80",
    href: "/categories/fashion"
  },
  {
    id: "jewelry",
    nameAr: "مجوهرات",
    imageUrl: "https://images.unsplash.com/photo-1515562141589-7f7a8d9ba96d?w=200&h=200&fit=crop&q=80",
    href: "/categories/fashion"
  },
  {
    id: "watches",
    nameAr: "ساعات",
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&h=200&fit=crop&q=80",
    href: "/categories/electronics"
  },
  {
    id: "dresses",
    nameAr: "فساتين",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop&q=80",
    href: "/categories/fashion"
  },
  {
    id: "abayas",
    nameAr: "عبايات",
    imageUrl: "https://images.unsplash.com/photo-1595777373136-3a51e9d22d46?w=200&h=200&fit=crop&q=80",
    href: "/categories/fashion"
  },
  {
    id: "baby-products",
    nameAr: "منتجات أطفال",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&q=80",
    href: "/categories/kids"
  },
  {
    id: "health-wellness",
    nameAr: "صحة وتغذية",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&q=80",
    href: "/categories/sports"
  },
  {
    id: "home-tools",
    nameAr: "أدوات منزلية",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&q=80",
    href: "/categories/home"
  },
  {
    id: "electronics",
    nameAr: "إلكترونيات",
    imageUrl: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200&h=200&fit=crop&q=80",
    href: "/categories/electronics"
  },
  {
    id: "books",
    nameAr: "كتب",
    imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop&q=80",
    href: "/categories/books"
  }
];

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=500&fit=crop&q=80",
    title: "اكتشفي أحدث صيحات الموضة",
    subtitle: "تجارب حقيقية من نساء مثلك عن المنتجات التي تستحق",
    ctaLabel: "استعرضي التجارب",
    ctaHref: "/posts"
  },
  {
    id: "slide-2",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=500&fit=crop&q=80",
    title: "منتجات العناية الأكثر تقييماً",
    subtitle: "اكتشفي تجارب المستخدمين لمستحضرات التجميل والعطور",
    ctaLabel: "تصفحي التصنيفات",
    ctaHref: "/categories/beauty"
  },
  {
    id: "slide-3",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop&q=80",
    title: "تجارب إلكترونيات بتقييمات دقيقة",
    subtitle: "أحدث الهواتف والسماعات والأجهزة تحت مجهر المستخدمين",
    ctaLabel: "اقرأ التجارب",
    ctaHref: "/categories/electronics"
  }
];

export const womenDiscoverySections = [
  {
    id: "women-trending",
    title: "الأكثر تداولًا لدى النساء",
    description: "منتجات وتجارب تهم المرأة العربية",
    circles: discoveryCircles.filter((c) =>
      ["perfumes", "makeup", "skincare", "haircare", "bags", "shoes", "sunglasses", "accessories", "jewelry", "watches", "dresses", "abayas"].includes(c.id)
    )
  },
  {
    id: "beauty",
    title: "جمال وعطور",
    description: "مستحضرات التجميل والعناية والعطور",
    circles: discoveryCircles.filter((c) =>
      ["perfumes", "makeup", "skincare", "haircare"].includes(c.id)
    )
  },
  {
    id: "fashion-accessories",
    title: "إكسسوارات وأزياء",
    description: "أحدث صيحات الإكسسوارات والموضة",
    circles: discoveryCircles.filter((c) =>
      ["bags", "shoes", "sunglasses", "accessories", "jewelry", "watches", "dresses", "abayas"].includes(c.id)
    )
  }
];
