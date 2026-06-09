export type SessionMode = "visitor" | "member";

export interface Category {
  slug: string;
  name: string;
  description: string;
  tone: "yellow" | "purple" | "green" | "blue" | "neutral";
}

export interface RatingDistributionItem {
  label: string;
  value: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  summary: string;
  rating: number;
  ratingCount: number;
  priceRange: string;
  imageTone: "cream" | "mint" | "rose" | "sky" | "sand" | "violet";
  tags: string[];
  suitableFor: string[];
  cautions: string[];
  specs: Record<string, string>;
  distribution: RatingDistributionItem[];
}

export interface DemoUser {
  username: string;
  name: string;
  title: string;
  city: string;
  avatarTone: "yellow" | "purple" | "green" | "blue" | "rose";
  bio: string;
}

export interface CommentItem {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  parentId?: string;
}

export interface Post {
  id: string;
  productId: string;
  author: string;
  publicListId?: string;
  rating: number;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  comments: CommentItem[];
}

export interface SavedList {
  id: string;
  ownerUsername: string;
  name: string;
  description: string;
  purpose: "personal_save" | "publisher_public";
  visibility: "private" | "public";
  coverTone?: "cream" | "mint" | "rose" | "sky" | "sand" | "violet";
  productIds: string[];
  postIds: string[];
}

export interface DraftPost {
  id: string;
  productId: string;
  publicListId?: string;
  rating: number;
  title: string;
  body: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface DemoProfile {
  name: string;
  username: string;
  city: string;
  bio: string;
  phone: string;
}

export interface DemoSettings {
  privateProfile: boolean;
  productAlerts: boolean;
  commentAlerts: boolean;
  weeklyDigest: boolean;
}

export interface DemoSession {
  mode: SessionMode;
  phone: string;
  intendedPath: string;
}

export interface AppState {
  version: number;
  onboardingDone: boolean;
  session: DemoSession;
  profile: DemoProfile;
  savedProductIds: string[];
  savedPostIds: string[];
  savedLists: SavedList[];
  publicLists: SavedList[];
  followingUsernames: string[];
  commentsByPostId: Record<string, CommentItem[]>;
  commentsByProductId: Record<string, CommentItem[]>;
  drafts: DraftPost[];
  publishedPosts: Post[];
  notifications: NotificationItem[];
  settings: DemoSettings;
}
