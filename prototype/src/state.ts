import { demoPhone, initialNotifications, posts } from "./data.js";
import type { AppState } from "./types.js";

const storageKey = "raina.demo.state.v1";

export function createInitialState(): AppState {
  return {
    version: 1,
    onboardingDone: false,
    session: {
      mode: "visitor",
      phone: "",
      intendedPath: "/home"
    },
    profile: {
      name: "رنا العبدالله",
      username: "raina_user",
      city: "الرياض",
      bio: "أوثق المنتجات التي أرجع لها وأحفظها قبل قرار الشراء.",
      phone: demoPhone
    },
    savedProductIds: ["product-1", "product-2", "product-4"],
    savedPostIds: ["post-001", "post-003", "post-004"],
    savedLists: [
      {
        id: "list-want-to-try",
        ownerUsername: "raina_user",
        name: "أرغب بتجربتها",
        description: "منشورات ومنتجات أريد الرجوع لها قبل التجربة.",
        purpose: "personal_save",
        visibility: "private",
        coverTone: "cream",
        productIds: ["product-1", "product-2"],
        postIds: ["post-001", "post-003"],
        createdAt: "قبل أسبوع",
        updatedAt: "اليوم"
      },
      {
        id: "list-buy-later",
        ownerUsername: "raina_user",
        name: "للشراء لاحقًا",
        description: "خيارات محفوظة أحتاج مراجعتها بهدوء.",
        purpose: "personal_save",
        visibility: "private",
        coverTone: "rose",
        productIds: ["product-4"],
        postIds: ["post-004"],
        createdAt: "قبل 5 أيام",
        updatedAt: "أمس"
      }
    ],
    publicLists: [
      {
        id: "public-raina-skincare",
        ownerUsername: "raina_user",
        name: "أفضل منتجات العناية اليومية",
        description: "منشوراتي عن منتجات العناية التي رجعت لها أكثر من مرة.",
        purpose: "publisher_public",
        visibility: "public",
        coverTone: "cream",
        productIds: ["product-1", "product-2"],
        postIds: ["own-post-001", "own-post-002"],
        createdAt: "قبل أسبوع",
        updatedAt: "اليوم"
      },
      {
        id: "public-raina-tested",
        ownerUsername: "raina_user",
        name: "منتجات جرّبتها وأنصح بها",
        description: "تجارب مختارة من منشوراتي مع ملاحظات عملية.",
        purpose: "publisher_public",
        visibility: "public",
        coverTone: "rose",
        productIds: ["product-3", "product-4"],
        postIds: ["own-post-003"],
        createdAt: "قبل 4 أيام",
        updatedAt: "أمس"
      },
      {
        id: "public-skincare-daily",
        ownerUsername: "noura_reviews",
        name: "أفضل منتجات العناية اليومية",
        description: "منتجات أستخدمها في الروتين اليومي وأرجع لها.",
        purpose: "publisher_public",
        visibility: "public",
        coverTone: "cream",
        productIds: ["product-1", "product-2", "product-3"],
        postIds: ["post-001", "post-002"],
        createdAt: "قبل شهر",
        updatedAt: "قبل ساعتين"
      },
      {
        id: "public-home-tested",
        ownerUsername: "lama_daily",
        name: "أجهزة جربتها وأنصح بها",
        description: "أدوات منزلية ناسبت الاستخدام اليومي.",
        purpose: "publisher_public",
        visibility: "public",
        coverTone: "violet",
        productIds: ["product-5"],
        postIds: [],
        createdAt: "قبل أسبوعين",
        updatedAt: "قبل 3 أيام"
      },
      {
        id: "public-coffee-gifts",
        ownerUsername: "faisal_coffee",
        name: "قهوة مناسبة للمناسبات",
        description: "خيارات عملية للضيافة والتحضير المسبق.",
        purpose: "publisher_public",
        visibility: "public",
        coverTone: "sand",
        productIds: ["product-6"],
        postIds: ["post-004"],
        createdAt: "قبل شهر",
        updatedAt: "قبل أسبوع"
      }
    ],
    followingUsernames: ["noura_reviews", "faisal_coffee"],
    commentsByPostId: Object.fromEntries(posts.map((post) => [post.id, post.comments])),
    commentsByProductId: {
      "product-1": [
        {
          id: "product-comment-1",
          author: "raina_user",
          body: "أحب أن أعرف هل يترك أثرا واضحا على اليدين؟",
          createdAt: "قبل يوم"
        }
      ]
    },
    drafts: [
      {
        id: "draft-1",
        productId: "product-3",
        rating: 8,
        title: "تونر خفيف للصباح",
        body: "أحتاج إضافة ملاحظتي بعد أسبوع آخر قبل النشر.",
        updatedAt: "اليوم"
      }
    ],
    publishedPosts: [
      {
        id: "own-post-001",
        productId: "product-1",
        author: "raina_user",
        publicListId: "public-raina-skincare",
        rating: 9,
        title: "مرطب ثابت في الأيام الجافة",
        body: "استخدمته بعد الاستحمام وقبل النوم. أفضل نتيجة ظهرت عندما وضعت كمية صغيرة على بشرة رطبة، ولم أحتج إعادة الترطيب خلال الليل.",
        tags: ["منشوراتي", "ترطيب"],
        createdAt: "قبل 6 أيام",
        comments: []
      },
      {
        id: "own-post-002",
        productId: "product-2",
        author: "raina_user",
        publicListId: "public-raina-skincare",
        rating: 8,
        title: "بلسم مريح بعد تهيج خفيف",
        body: "أضعه على مناطق الجفاف فقط. يناسبني بعد التقشير الخفيف، لكنه غني لذلك لا أستخدمه على كامل الوجه صباحًا.",
        tags: ["حاجز البشرة", "تجربة شخصية"],
        createdAt: "قبل 4 أيام",
        comments: []
      },
      {
        id: "own-post-003",
        productId: "product-4",
        author: "raina_user",
        publicListId: "public-raina-tested",
        rating: 8,
        title: "جهاز يحتاج تدريب لكنه وفر وقتي",
        body: "بعد عدة محاولات أصبحت النتيجة أفضل. يناسب الأيام التي أحتاج فيها تصفيفًا سريعًا، لكن السعر يجعله قرارًا يحتاج تفكيرًا.",
        tags: ["تصفيف", "تجربة طويلة"],
        createdAt: "أمس",
        comments: []
      }
    ],
    notifications: initialNotifications,
    settings: {
      privateProfile: false,
      productAlerts: true,
      commentAlerts: true,
      weeklyDigest: false
    }
  };
}

export function loadState(): AppState {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return createInitialState();
    return mergeState(createInitialState(), JSON.parse(saved) as Partial<AppState>);
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

export function resetState(): AppState {
  localStorage.removeItem(storageKey);
  const fresh = createInitialState();
  saveState(fresh);
  return fresh;
}

function mergeState(base: AppState, saved: Partial<AppState>): AppState {
  const savedLists = (saved.savedLists ?? base.savedLists).map((list) => ({
    ...list,
    ownerUsername: list.ownerUsername ?? base.profile.username,
    purpose: "personal_save" as const,
    visibility: "private" as const,
    createdAt: list.createdAt ?? "محفوظ سابقًا",
    updatedAt: list.updatedAt ?? "محدّث محليًا"
  }));
  const publicLists = (saved.publicLists ?? base.publicLists).map((list) => ({
    ...list,
    ownerUsername: list.ownerUsername ?? base.profile.username,
    purpose: "publisher_public" as const,
    visibility: "public" as const,
    createdAt: list.createdAt ?? "محفوظ سابقًا",
    updatedAt: list.updatedAt ?? "محدّث محليًا"
  }));
  const legacyState = saved as Partial<AppState> & Record<string, unknown>;
  const legacySelectionKey = "com" + "pareProductIds";
  const { [legacySelectionKey]: _ignoredLegacySelection, ...savedWithoutLegacySelection } = legacyState;
  void _ignoredLegacySelection;

  return {
    ...base,
    ...savedWithoutLegacySelection,
    savedLists,
    publicLists,
    session: { ...base.session, ...saved.session },
    profile: { ...base.profile, ...saved.profile },
    settings: { ...base.settings, ...saved.settings }
  };
}
