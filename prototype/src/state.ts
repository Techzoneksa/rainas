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
      bio: "أوثق المنتجات التي أرجع لها وأقارن قبل الشراء.",
      phone: demoPhone
    },
    savedProductIds: ["product-2"],
    savedPostIds: ["post-001"],
    savedLists: [
      {
        id: "list-skincare",
        name: "روتين البشرة الهادئ",
        description: "منتجات أريد الرجوع لها قبل تحديث الروتين.",
        productIds: ["product-1", "product-2"],
        postIds: ["post-001"]
      }
    ],
    followingUsernames: ["noura_reviews", "faisal_coffee"],
    compareProductIds: ["product-1", "product-2"],
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
  return {
    ...base,
    ...saved,
    session: { ...base.session, ...saved.session },
    profile: { ...base.profile, ...saved.profile },
    settings: { ...base.settings, ...saved.settings }
  };
}
