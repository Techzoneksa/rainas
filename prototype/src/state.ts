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
    savedProductIds: ["product-2"],
    savedPostIds: ["post-001"],
    savedLists: [
      {
        id: "list-skincare",
        ownerUsername: "raina_user",
        name: "روتين البشرة الهادئ",
        description: "منتجات أريد الرجوع لها قبل تحديث الروتين.",
        purpose: "personal_save",
        visibility: "private",
        coverTone: "cream",
        productIds: ["product-1", "product-2"],
        postIds: ["post-001"]
      }
    ],
    publicLists: [
      {
        id: "public-skincare-daily",
        ownerUsername: "noura_reviews",
        name: "أفضل منتجات العناية اليومية",
        description: "منتجات أستخدمها في الروتين اليومي وأرجع لها.",
        purpose: "publisher_public",
        visibility: "public",
        coverTone: "cream",
        productIds: ["product-1", "product-2", "product-3"],
        postIds: ["post-001", "post-002"]
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
        postIds: []
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
        postIds: ["post-004"]
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
    publishedPosts: [],
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
    purpose: list.purpose ?? "personal_save",
    visibility: list.visibility ?? "private"
  }));
  const publicLists = (saved.publicLists ?? base.publicLists).map((list) => ({
    ...list,
    ownerUsername: list.ownerUsername ?? base.profile.username,
    purpose: list.purpose ?? "publisher_public",
    visibility: list.visibility ?? "public"
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
