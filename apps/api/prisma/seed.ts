import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const localDatabaseUrl =
  "postgresql://raina:raina_local_password@localhost:5432/raina_dev?schema=public";

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL ?? localDatabaseUrl)
});

const now = new Date();
const daysAgo = (days: number): Date => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
const demoImageUrl = (photoId: string, width = 800, height = 800): string =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;

const users = [
  { id: "usr_owner", phone: "+966500000001", role: "OWNER" as const },
  { id: "usr_01", phone: "+966500000011", role: "USER" as const },
  { id: "usr_02", phone: "+966500000012", role: "USER" as const },
  { id: "usr_03", phone: "+966500000013", role: "USER" as const },
  { id: "usr_04", phone: "+966500000014", role: "USER" as const },
  { id: "usr_05", phone: "+966500000015", role: "USER" as const },
  { id: "usr_06", phone: "+966500000016", role: "USER" as const },
  { id: "usr_07", phone: "+966500000017", role: "USER" as const },
  { id: "usr_08", phone: "+966500000018", role: "USER" as const }
];

const profiles = [
  {
    id: "prf_owner",
    userId: "usr_owner",
    username: "owner",
    displayName: "مالك رأينا",
    bio: "حساب إدارة تجريبي لبيئة التطوير.",
    city: "الرياض"
  },
  {
    id: "prf_01",
    userId: "usr_01",
    username: "rana",
    displayName: "رنا العبدالله",
    bio: "أشارك تجاربي اليومية مع المنتجات.",
    city: "جدة"
  },
  {
    id: "prf_02",
    userId: "usr_02",
    username: "noura",
    displayName: "نورة خالد",
    bio: "أحب المنتجات العملية والواضحة.",
    city: "الرياض"
  },
  {
    id: "prf_03",
    userId: "usr_03",
    username: "sara",
    displayName: "سارة فيصل",
    bio: "تجارب مختصرة قبل الشراء.",
    city: "الدمام"
  },
  {
    id: "prf_04",
    userId: "usr_04",
    username: "lama",
    displayName: "لمى صالح",
    bio: "أرتب المنتجات حسب الاستخدام الحقيقي.",
    city: "الخبر"
  },
  {
    id: "prf_05",
    userId: "usr_05",
    username: "reem",
    displayName: "ريم محمد",
    bio: "مهتمة بالعناية والقهوة وأدوات البيت.",
    city: "مكة"
  },
  {
    id: "prf_06",
    userId: "usr_06",
    username: "huda",
    displayName: "هدى علي",
    bio: "أكتب ملاحظات صريحة بعد التجربة.",
    city: "أبها"
  },
  {
    id: "prf_07",
    userId: "usr_07",
    username: "mona",
    displayName: "منى إبراهيم",
    bio: "أبحث عن الجودة والسعر المناسب.",
    city: "المدينة"
  },
  {
    id: "prf_08",
    userId: "usr_08",
    username: "amal",
    displayName: "أمل حسن",
    bio: "أوثق المنتجات التي تستحق الانتباه.",
    city: "الطائف"
  }
];

const categories = [
  [
    "cat_el",
    "electronics",
    "إلكترونيات",
    "أجهزة ذكية، لابتوبات، جوالات، وملحقاتها",
    10,
    demoImageUrl("1468495244123-6c6c332eeece")
  ],
  [
    "cat_bty",
    "beauty",
    "جمال وعناية",
    "مستحضرات تجميل، عطور، ومواد عناية شخصية",
    20,
    demoImageUrl("1596462502278-27bfdc403348")
  ],
  [
    "cat_home",
    "home",
    "منزل ومطبخ",
    "أثاث، أدوات مطبخ، ديكور المنزل",
    30,
    demoImageUrl("1556909114-f6e7ad7d3136")
  ],
  [
    "cat_food",
    "food",
    "طعام وشراب",
    "منتجات غذائية، مشروبات، ووجبات خفيفة",
    40,
    demoImageUrl("1504674900247-0877df9cc836")
  ],
  [
    "cat_fash",
    "fashion",
    "أزياء",
    "ملابس، أحذية، إكسسوارات",
    50,
    demoImageUrl("1445205170230-053b83016050")
  ],
  [
    "cat_kids",
    "kids",
    "أطفال",
    "ألعاب، حاجيات الأطفال، تعليم",
    60,
    demoImageUrl("1546435770-a3e426bf472b")
  ],
  [
    "cat_sport",
    "sports",
    "رياضة",
    "أدوات رياضية، ملابس رياضية، مكملات",
    70,
    demoImageUrl("1461896836934-bd45ba8fcf9b")
  ],
  [
    "cat_books",
    "books",
    "كتب",
    "كتب عربية، كتب تعليمية، روايات",
    80,
    demoImageUrl("1495446815901-a7297e633e8d")
  ]
] as const;

const productPhotoIdsByCategoryId: Record<string, readonly string[]> = {
  cat_el: [
    "1468495244123-6c6c332eeece",
    "1510557880182-3d4d3cba35a5",
    "1580910051074-3eb694886505",
    "1516321318423-f06f85e504b3"
  ],
  cat_bty: [
    "1596462502278-27bfdc403348",
    "1598440947619-2c35fc9aa908",
    "1512496015851-a90fb38ba796",
    "1522335789203-aabd1fc54bc9"
  ],
  cat_home: [
    "1556909114-f6e7ad7d3136",
    "1556911220-bff31c812dba",
    "1586201375761-83865001e31c",
    "1585515320310-259814833e62"
  ],
  cat_food: [
    "1504674900247-0877df9cc836",
    "1495474472287-4d71bcdd2085",
    "1514432324607-a09d9b4aefdd",
    "1442512595331-e89e73853f31"
  ],
  cat_fash: [
    "1445205170230-053b83016050",
    "1542291026-7eec264c27ff",
    "1594035910387-fea47794261f"
  ],
  cat_kids: [
    "1546435770-a3e426bf472b",
    "1566576912321-d58ddd7a6088",
    "1546519638-68e109498ffc"
  ],
  cat_sport: [
    "1461896836934-bd45ba8fcf9b",
    "1517836357463-d25dfeac3438",
    "1518611012118-696072aa579a"
  ],
  cat_books: [
    "1495446815901-a7297e633e8d",
    "1524996470627-2b0f7b5f9b3a",
    "1491841573635-6e87b8c4e7b1"
  ]
};

const getProductMediaUrl = (categoryId: string, offset: number): string => {
  const photoIds =
    productPhotoIdsByCategoryId[categoryId] ?? productPhotoIdsByCategoryId.cat_skincare;
  const photoId = photoIds[offset % photoIds.length] ?? "1598440947619-2c35fc9aa908";
  return demoImageUrl(photoId);
};

const brands = [
  ["brd_01", "luma", "لوما"],
  ["brd_02", "safa", "صفا"],
  ["brd_03", "bayt", "بيت"],
  ["brd_04", "qahwati", "قهوتي"],
  ["brd_05", "naseem", "نسيم"],
  ["brd_06", "rawan", "روان"],
  ["brd_07", "tala", "تالا"],
  ["brd_08", "careline", "كيرلاين"],
  ["brd_09", "barista-house", "باريستا هاوس"],
  ["brd_10", "sahl", "سهل"],
  ["brd_11", "mini-tech", "ميني تك"],
  ["brd_12", "ward", "ورد"]
] as const;

const products = Array.from({ length: 30 }, (_, index) => {
  const number = index + 1;
  const category = categories[index % categories.length];
  const brand = brands[index % brands.length];
  return {
    id: `prd_${String(number).padStart(2, "0")}`,
    slug: `product-${String(number).padStart(2, "0")}`,
    brandId: brand[0],
    categoryId: category[0],
    nameAr: `منتج تجريبي ${number}`,
    summaryAr: `وصف مختصر لمنتج ${number} ضمن ${category[2]}.`,
    descriptionAr: `بيانات تطوير تساعد على اختبار البحث والفرز والتقييمات للمنتج ${number}.`,
    priceMin: 20 + number,
    priceMax: 35 + number * 2,
    ratingAverage: 0,
    ratingCount: 0
  };
});

const posts = Array.from({ length: 24 }, (_, index) => {
  const number = index + 1;
  const rating = (index % 10) + 1;
  return {
    id: `pst_${String(number).padStart(2, "0")}`,
    authorId: users[(index % 8) + 1]?.id ?? "usr_01",
    productId: products[index % products.length]?.id ?? "prd_01",
    rating,
    title: `تجربة منتج رقم ${number}`,
    body: `هذه تجربة تطوير مفصلة للمنتج رقم ${number}. النص يوضح الانطباع العام والنقاط التي تهم المستخدم قبل الشراء.`,
    status: "PUBLISHED" as const,
    publishedAt: daysAgo(24 - index)
  };
});

const postPros = posts.flatMap((post, index) => [
  {
    id: `${post.id}_pro_1`,
    postId: post.id,
    body: `ميزة واضحة في التجربة ${index + 1}`,
    sortOrder: 1
  },
  {
    id: `${post.id}_pro_2`,
    postId: post.id,
    body: "سهل الاستخدام في الروتين اليومي",
    sortOrder: 2
  }
]);

const postCons = posts.flatMap((post, index) => [
  {
    id: `${post.id}_con_1`,
    postId: post.id,
    body: `ملاحظة تحتاج انتباه في التجربة ${index + 1}`,
    sortOrder: 1
  }
]);

const topComments = Array.from({ length: 40 }, (_, index) => {
  const number = index + 1;
  const post = posts[index % posts.length] ?? posts[0];
  return {
    id: `cmt_${String(number).padStart(2, "0")}`,
    authorId: users[((index + 2) % 8) + 1]?.id ?? "usr_02",
    targetType: "POST" as const,
    postId: post.id,
    body: `تعليق تجريبي رقم ${number} على التجربة.`,
    createdAt: daysAgo(10 - (index % 10))
  };
});

const replies = Array.from({ length: 10 }, (_, index) => {
  const number = index + 1;
  const parent = topComments[index] ?? topComments[0];
  return {
    id: `rpl_${String(number).padStart(2, "0")}`,
    authorId: users[((index + 4) % 8) + 1]?.id ?? "usr_03",
    targetType: "POST" as const,
    postId: parent.postId,
    parentId: parent.id,
    body: `رد تجريبي رقم ${number}.`,
    createdAt: daysAgo(5 - (index % 5))
  };
});

const follows = Array.from({ length: 18 }, (_, index) => ({
  followerId: users[(index % 8) + 1]?.id ?? "usr_01",
  followingId: users[((index + 3) % 8) + 1]?.id ?? "usr_04"
})).filter((follow) => follow.followerId !== follow.followingId);

const publicLists = Array.from({ length: 5 }, (_, index) => ({
  id: `lst_pub_${index + 1}`,
  ownerId: users[index + 1]?.id ?? "usr_01",
  slug: `public-list-${index + 1}`,
  title: `قائمة منشورات ${index + 1}`,
  description: "قائمة عامة مرتبطة بتجارب الناشر.",
  purpose: "PUBLISHER_PUBLIC" as const,
  visibility: "PUBLIC" as const
}));

const personalLists = Array.from({ length: 5 }, (_, index) => ({
  id: `lst_prv_${index + 1}`,
  ownerId: users[index + 1]?.id ?? "usr_01",
  slug: `saved-list-${index + 1}`,
  title: `محفوظاتي ${index + 1}`,
  description: "قائمة حفظ خاصة بمالك الحساب.",
  purpose: "PERSONAL_SAVE" as const,
  visibility: "PRIVATE" as const
}));

const listItems = [
  ...publicLists.flatMap((list, index) => [
    {
      id: `${list.id}_post`,
      listId: list.id,
      targetType: "POST" as const,
      targetId: posts[index]?.id ?? "pst_01",
      sortOrder: 1
    },
    {
      id: `${list.id}_product`,
      listId: list.id,
      targetType: "PRODUCT" as const,
      targetId: products[index]?.id ?? "prd_01",
      sortOrder: 2
    }
  ]),
  ...personalLists.flatMap((list, index) => [
    {
      id: `${list.id}_post`,
      listId: list.id,
      targetType: "POST" as const,
      targetId: posts[index + 5]?.id ?? "pst_06",
      sortOrder: 1
    },
    {
      id: `${list.id}_product`,
      listId: list.id,
      targetType: "PRODUCT" as const,
      targetId: products[index + 5]?.id ?? "prd_06",
      sortOrder: 2
    }
  ])
];

const savedItems = Array.from({ length: 20 }, (_, index) => ({
  id: `sav_${String(index + 1).padStart(2, "0")}`,
  userId: users[(index % 8) + 1]?.id ?? "usr_01",
  targetType: index % 2 === 0 ? ("POST" as const) : ("PRODUCT" as const),
  targetId:
    index % 2 === 0
      ? (posts[index % posts.length]?.id ?? "pst_01")
      : (products[index % products.length]?.id ?? "prd_01")
}));

const notifications = Array.from({ length: 15 }, (_, index) => ({
  id: `ntf_${String(index + 1).padStart(2, "0")}`,
  userId: users[(index % 8) + 1]?.id ?? "usr_01",
  type:
    index % 3 === 0
      ? ("SYSTEM" as const)
      : index % 3 === 1
        ? ("COMMENT_CREATED" as const)
        : ("FOLLOW_CREATED" as const),
  title: `تنبيه تجريبي ${index + 1}`,
  body: "تنبيه يستخدم لاختبار مركز الإشعارات.",
  payload: { source: "seed", order: index + 1 },
  readAt: index % 4 === 0 ? daysAgo(1) : null
}));

const reports = Array.from({ length: 6 }, (_, index) => ({
  id: `rpt_${index + 1}`,
  reporterId: users[index + 1]?.id ?? "usr_01",
  targetType: index % 2 === 0 ? ("POST" as const) : ("COMMENT" as const),
  targetId: index % 2 === 0 ? (posts[index]?.id ?? "pst_01") : (topComments[index]?.id ?? "cmt_01"),
  reason: "محتوى يحتاج مراجعة",
  details: "بلاغ تجريبي لمرحلة الباكند.",
  status: index % 3 === 0 ? ("REVIEWING" as const) : ("OPEN" as const)
}));

const categoryRecords = categories.map(
  ([id, slug, nameAr, descriptionAr, sortOrder, imageUrl]) => ({
    id,
    slug,
    nameAr,
    descriptionAr,
    sortOrder,
    imageUrl
  })
);

const productMedia = products.map((product, index) => ({
  id: `${product.id}_media_1`,
  productId: product.id,
  type: "IMAGE" as const,
  url: getProductMediaUrl(product.categoryId, index),
  altAr: `صورة ${product.nameAr}`,
  sortOrder: 1,
  moderationStatus: "APPROVED" as const
}));

const postMedia = posts.map((post, index) => {
  const product =
    products.find((item) => item.id === post.productId) ?? products[index % products.length];
  return {
    id: `${post.id}_media_1`,
    postId: post.id,
    type: "IMAGE" as const,
    url:
      product === undefined
        ? demoImageUrl("1495474472287-4d71bcdd2085")
        : getProductMediaUrl(product.categoryId, index + 1),
    altAr: `صورة تجربة ${index + 1}`,
    sortOrder: 1,
    moderationStatus: "APPROVED" as const
  };
});

async function main(): Promise<void> {
  await prisma.user.createMany({ data: users, skipDuplicates: true });
  await prisma.profile.createMany({ data: profiles, skipDuplicates: true });
  for (const category of categoryRecords) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        slug: category.slug,
        nameAr: category.nameAr,
        descriptionAr: category.descriptionAr,
        imageUrl: category.imageUrl,
        sortOrder: category.sortOrder
      },
      create: category
    });
  }
  await prisma.brand.createMany({
    data: brands.map(([id, slug, name]) => ({ id, slug, name })),
    skipDuplicates: true
  });
  await prisma.product.createMany({ data: products, skipDuplicates: true });
  for (const media of productMedia) {
    await prisma.productMedia.upsert({
      where: { id: media.id },
      update: {
        type: media.type,
        url: media.url,
        altAr: media.altAr,
        sortOrder: media.sortOrder,
        moderationStatus: media.moderationStatus,
        deletedAt: null
      },
      create: media
    });
  }
  await prisma.productSpecification.createMany({
    data: products.flatMap((product) => [
      {
        id: `${product.id}_spec_size`,
        productId: product.id,
        nameAr: "الحجم",
        valueAr: "حجم متوسط",
        sortOrder: 1
      },
      {
        id: `${product.id}_spec_origin`,
        productId: product.id,
        nameAr: "الاستخدام",
        valueAr: "استخدام يومي",
        sortOrder: 2
      }
    ]),
    skipDuplicates: true
  });
  await prisma.post.createMany({ data: posts, skipDuplicates: true });
  await prisma.postPro.createMany({ data: postPros, skipDuplicates: true });
  await prisma.postCon.createMany({ data: postCons, skipDuplicates: true });
  for (const media of postMedia) {
    await prisma.postMedia.upsert({
      where: { id: media.id },
      update: {
        type: media.type,
        url: media.url,
        altAr: media.altAr,
        sortOrder: media.sortOrder,
        moderationStatus: media.moderationStatus,
        deletedAt: null
      },
      create: media
    });
  }
  await prisma.comment.createMany({ data: [...topComments, ...replies], skipDuplicates: true });
  await prisma.follow.createMany({ data: follows, skipDuplicates: true });
  await prisma.userList.createMany({
    data: [...publicLists, ...personalLists],
    skipDuplicates: true
  });
  await prisma.userListItem.createMany({ data: listItems, skipDuplicates: true });
  await prisma.savedItem.createMany({ data: savedItems, skipDuplicates: true });
  await prisma.notification.createMany({ data: notifications, skipDuplicates: true });
  await prisma.report.createMany({ data: reports, skipDuplicates: true });
  await prisma.appSetting.createMany({
    data: [
      {
        key: "rating_scale",
        value: { min: 1, max: 10 },
        valueType: "JSON",
        description: "مدى التقييم المعتمد في رأينا"
      },
      {
        key: "reports_enabled",
        value: true,
        valueType: "BOOLEAN",
        description: "تفعيل استقبال البلاغات"
      },
      {
        key: "demo_identity_header",
        value: "X-Demo-User-Id",
        valueType: "STRING",
        description: "هيدر هوية التطوير فقط"
      }
    ],
    skipDuplicates: true
  });
  await prisma.adminAuditLog.createMany({
    data: [
      {
        id: "aud_seed_1",
        actorId: "usr_owner",
        action: "seed.created",
        targetType: "database",
        metadata: { phase: 4 }
      }
    ],
    skipDuplicates: true
  });

  for (const product of products) {
    const relatedPosts = posts.filter((post) => post.productId === product.id);
    if (relatedPosts.length === 0) continue;
    const sum = relatedPosts.reduce((total, post) => total + post.rating, 0);
    await prisma.product.update({
      where: { id: product.id },
      data: {
        ratingAverage: Number((sum / relatedPosts.length).toFixed(2)),
        ratingCount: relatedPosts.length
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
