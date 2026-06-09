import type { Category, DemoUser, NotificationItem, Post, Product } from "./types.js";

export const demoPhone = "501234567";
export const demoOtp = "1234";

export const categories: Category[] = [
  {
    slug: "skincare",
    name: "العناية بالبشرة",
    description: "مرطبات، واقيات شمس، ومنتجات تهدئة للبشرة الحساسة.",
    tone: "yellow"
  },
  {
    slug: "haircare",
    name: "العناية بالشعر",
    description: "شامبو، ماسكات، وزيوت مناسبة للرطوبة والحرارة.",
    tone: "purple"
  },
  {
    slug: "home",
    name: "المنزل الذكي",
    description: "أجهزة صغيرة وتجارب استخدام يومية قبل قرار الشراء.",
    tone: "blue"
  },
  {
    slug: "coffee",
    name: "القهوة والمطبخ",
    description: "معدات تحضير، حافظات، وتجارب عملية داخل البيت.",
    tone: "green"
  }
];

export const products: Product[] = [
  {
    id: "product-1",
    slug: "cerave-moisturizing-cream",
    name: "كريم الترطيب CeraVe",
    brand: "CeraVe",
    categorySlug: "skincare",
    summary: "مرطب يومي كثيف مناسب للجفاف، يترك طبقة مريحة دون عطر واضح.",
    rating: 8.7,
    ratingCount: 342,
    priceRange: "68 - 95 ر.س",
    imageTone: "cream",
    tags: ["ترطيب عميق", "بشرة جافة", "بدون عطر"],
    suitableFor: ["البشرة الجافة", "الاستخدام الليلي", "الجو الجاف"],
    cautions: ["قد يكون ثقيلا على البشرة الدهنية", "يفضل اختبار كمية صغيرة أولا"],
    specs: {
      الحجم: "340 جم",
      القوام: "كريم كثيف",
      العطر: "بدون عطر",
      "أفضل استخدام": "بعد الاستحمام أو قبل النوم"
    },
    distribution: [
      { label: "الترطيب", value: 92 },
      { label: "راحة البشرة", value: 88 },
      { label: "القيمة مقابل السعر", value: 81 },
      { label: "سهولة الامتصاص", value: 74 }
    ]
  },
  {
    id: "product-2",
    slug: "la-roche-posay-cicaplast-balm",
    name: "بلسم Cicaplast Baume B5",
    brand: "La Roche-Posay",
    categorySlug: "skincare",
    summary: "بلسم ترميم للحواجز الجلدية، محبوب بعد التهيج أو إجراءات البشرة الخفيفة.",
    rating: 8.9,
    ratingCount: 287,
    priceRange: "52 - 78 ر.س",
    imageTone: "sky",
    tags: ["تهدئة", "حاجز البشرة", "بعد التقشير"],
    suitableFor: ["الاحمرار الخفيف", "مناطق الجفاف", "الروتين العلاجي"],
    cautions: ["قوامه غني", "ليس بديلا عن علاج طبي عند الالتهاب"],
    specs: {
      الحجم: "100 مل",
      القوام: "بلسم",
      العطر: "هادئ جدا",
      "أفضل استخدام": "طبقة رقيقة على المناطق الجافة"
    },
    distribution: [
      { label: "التهدئة", value: 94 },
      { label: "إصلاح الحاجز", value: 90 },
      { label: "القيمة مقابل السعر", value: 79 },
      { label: "ملاءمة الجو الحار", value: 71 }
    ]
  },
  {
    id: "product-3",
    slug: "anua-soothing-toner",
    name: "تونر أنوا المهدئ",
    brand: "Anua",
    categorySlug: "skincare",
    summary: "تونر خفيف للروتين الصباحي، يعطي إحساسا منعشا قبل المرطب وواقي الشمس.",
    rating: 7.8,
    ratingCount: 198,
    priceRange: "61 - 89 ر.س",
    imageTone: "mint",
    tags: ["خفيف", "تهدئة", "روتين صباحي"],
    suitableFor: ["البشرة المختلطة", "طبقات الترطيب الخفيفة", "قبل المكياج"],
    cautions: ["لا يغني عن المرطب", "النتيجة تعتمد على باقي الروتين"],
    specs: {
      الحجم: "250 مل",
      القوام: "سائل خفيف",
      العطر: "بدون عطر قوي",
      "أفضل استخدام": "بعد الغسول مباشرة"
    },
    distribution: [
      { label: "الخفة", value: 91 },
      { label: "التهدئة", value: 78 },
      { label: "الترطيب", value: 64 },
      { label: "القيمة مقابل السعر", value: 75 }
    ]
  },
  {
    id: "product-4",
    slug: "dyson-airwrap-travel",
    name: "مصفف Airwrap للسفر",
    brand: "Dyson",
    categorySlug: "haircare",
    summary: "مصفف شعر فاخر للاستخدام السريع، مناسب لمن يريد نتيجة صالون في البيت.",
    rating: 8.1,
    ratingCount: 156,
    priceRange: "1899 - 2299 ر.س",
    imageTone: "rose",
    tags: ["تصفيف سريع", "شعر متوسط", "جهاز فاخر"],
    suitableFor: ["الشعر متوسط الكثافة", "التصفيف اليومي", "السفر"],
    cautions: ["سعر مرتفع", "يحتاج تعودا على الملحقات"],
    specs: {
      الطاقة: "1300 واط",
      الملحقات: "فرش وفوهات متعددة",
      الوزن: "خفيف نسبيا",
      "أفضل استخدام": "على شعر رطب قليلا"
    },
    distribution: [
      { label: "النتيجة النهائية", value: 87 },
      { label: "سهولة التعلم", value: 68 },
      { label: "القيمة مقابل السعر", value: 59 },
      { label: "السرعة", value: 89 }
    ]
  },
  {
    id: "product-5",
    slug: "smart-water-flosser",
    name: "جهاز تنظيف الأسنان المائي",
    brand: "Waterpik",
    categorySlug: "home",
    summary: "جهاز يومي للعناية بالفم، يعطي شعورا بالنظافة خاصة مع التقويم أو الجسور.",
    rating: 7.4,
    ratingCount: 121,
    priceRange: "180 - 320 ر.س",
    imageTone: "violet",
    tags: ["عناية يومية", "تقويم الأسنان", "سهل التنظيف"],
    suitableFor: ["التقويم", "الحساسية الخفيفة", "الاستخدام العائلي"],
    cautions: ["يحتاج ماء كافيا", "الضغط العالي لا يناسب الجميع"],
    specs: {
      السعة: "600 مل",
      المستويات: "10 مستويات",
      الملحقات: "رؤوس متعددة",
      "أفضل استخدام": "بعد تنظيف الأسنان بالفرشاة"
    },
    distribution: [
      { label: "النظافة", value: 85 },
      { label: "سهولة الاستخدام", value: 72 },
      { label: "الهدوء", value: 58 },
      { label: "القيمة مقابل السعر", value: 69 }
    ]
  },
  {
    id: "product-6",
    slug: "cold-brew-maker",
    name: "محضر القهوة الباردة",
    brand: "Hario",
    categorySlug: "coffee",
    summary: "إبريق بسيط لتحضير قهوة باردة ناعمة، مناسب للدوام والبيت.",
    rating: 8.3,
    ratingCount: 94,
    priceRange: "85 - 140 ر.س",
    imageTone: "sand",
    tags: ["قهوة باردة", "سهل التنظيف", "استخدام يومي"],
    suitableFor: ["محبي القهوة الباردة", "التحضير المسبق", "المكاتب"],
    cautions: ["يحتاج وقت نقع طويل", "النتيجة تعتمد على البن والطحنة"],
    specs: {
      السعة: "1 لتر",
      المادة: "زجاج وفلتر ناعم",
      التنظيف: "سهل",
      "أفضل استخدام": "نقع من 8 إلى 12 ساعة"
    },
    distribution: [
      { label: "الطعم", value: 84 },
      { label: "سهولة التنظيف", value: 88 },
      { label: "القيمة مقابل السعر", value: 82 },
      { label: "سرعة التحضير", value: 44 }
    ]
  }
];

export const users: DemoUser[] = [
  {
    username: "noura_reviews",
    name: "نورة العتيبي",
    title: "تجارب عناية بالبشرة",
    city: "الرياض",
    avatarTone: "yellow",
    bio: "أشارك تجارب واقعية بعد استخدام لا يقل عن أسبوعين، مع التركيز على البشرة الحساسة."
  },
  {
    username: "lama_daily",
    name: "لمى القحطاني",
    title: "اختيارات يومية للبيت",
    city: "الخبر",
    avatarTone: "purple",
    bio: "أحب المنتجات العملية التي توفر وقتا وتستحق مكانها في البيت."
  },
  {
    username: "salma_beauty",
    name: "سلمى الحربي",
    title: "شعر ومكياج بسيط",
    city: "جدة",
    avatarTone: "rose",
    bio: "أجرب أجهزة الشعر والروتين السريع بدون مبالغة."
  },
  {
    username: "faisal_coffee",
    name: "فيصل الناصر",
    title: "قهوة ومعدات منزلية",
    city: "الدمام",
    avatarTone: "green",
    bio: "أوثق أدوات القهوة من ناحية الطعم والتنظيف والقيمة."
  }
];

export const posts: Post[] = [
  {
    id: "post-001",
    productId: "product-1",
    author: "noura_reviews",
    publicListId: "public-skincare-daily",
    rating: 9,
    title: "أكثر مرطب رجعت له في الشتاء",
    body:
      "استخدمته ليلا لمدة ثلاثة أسابيع. القوام غني، لذلك أضع كمية صغيرة وأركز على الخدين. أفضل نقطة أنه لا يسبب لسعة عند الجفاف، لكن في النهار أحتاج كمية أخف.",
    tags: ["تجربة طويلة", "بشرة حساسة"],
    createdAt: "قبل ساعتين",
    comments: [
      {
        id: "comment-1",
        author: "lama_daily",
        body: "هل يناسب تحت واقي الشمس؟",
        createdAt: "قبل ساعة"
      },
      {
        id: "comment-2",
        author: "noura_reviews",
        body: "بالنسبة لي أفضل استخدامه ليلا لأنه غني.",
        createdAt: "قبل 45 دقيقة",
        parentId: "comment-1"
      }
    ]
  },
  {
    id: "post-002",
    productId: "product-2",
    author: "noura_reviews",
    publicListId: "public-skincare-daily",
    rating: 9,
    title: "أنقذني بعد التقشير الخفيف",
    body:
      "أستخدمه كطبقة تهدئة عند الاحمرار. كمية صغيرة تكفي، ويحتاج وقتا بسيطا حتى يختفي اللمعان. أراه ممتازا في حقيبة السفر.",
    tags: ["تهدئة", "سفر"],
    createdAt: "أمس",
    comments: []
  },
  {
    id: "post-003",
    productId: "product-4",
    author: "salma_beauty",
    rating: 8,
    title: "النتيجة جميلة لكن التعلم مهم",
    body:
      "في أول أسبوع لم تعجبني النتيجة، ثم تغيرت تماما بعد ما عرفت كمية الرطوبة المناسبة للشعر. سعره عالي، لذلك أنصح بتجربته من صديقة قبل القرار.",
    tags: ["جهاز شعر", "قيمة"],
    createdAt: "قبل 3 أيام",
    comments: [
      {
        id: "comment-3",
        author: "raina_user",
        body: "هل يناسب الشعر القصير؟",
        createdAt: "قبل يوم"
      }
    ]
  },
  {
    id: "post-004",
    productId: "product-6",
    author: "faisal_coffee",
    publicListId: "public-coffee-gifts",
    rating: 8,
    title: "أبسط طريقة لقهوة باردة ثابتة",
    body:
      "أضع البن مساء وأصفيه صباحا. التنظيف سهل والطعم ثابت إذا كانت الطحنة خشنة. ليس مناسبا لمن يريد قهوة فورية، لكنه ممتاز للتحضير المسبق.",
    tags: ["قهوة", "تحضير مسبق"],
    createdAt: "قبل أسبوع",
    comments: []
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "note-1",
    title: "تعليق جديد على تجربتك",
    body: "سألت لمى عن طريقة استخدام كريم الترطيب.",
    createdAt: "قبل 10 دقائق",
    read: false
  },
  {
    id: "note-2",
    title: "قائمة عامة جديدة",
    body: "أضيف منتج محفوظ إلى قائمة ناشر عامة يمكنك فتحها من الملف الشخصي.",
    createdAt: "قبل ساعة",
    read: false
  },
  {
    id: "note-3",
    title: "تذكير بالمسودة",
    body: "لديك تجربة محفوظة يمكن نشرها عند جاهزيتها.",
    createdAt: "أمس",
    read: true
  }
];
