import type { ApiError, PaginationMeta } from "@raina/shared-types";

export interface ApiSuccessResponse<TData> {
  data: TData;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  error: ApiError;
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;

export interface ApiPageResponse<TItem> {
  data: TItem[];
  meta: PaginationMeta;
}

export interface ApiItemResponse<TItem> {
  data: TItem;
}

export type ApiSort = "created_desc" | "created_asc" | "rating_desc" | "rating_asc";

export interface ListQuery {
  page?: number | undefined;
  limit?: number | undefined;
}

export interface SearchQuery extends ListQuery {
  q?: string | undefined;
  categoryId?: string | undefined;
  brandId?: string | undefined;
  sort?: ApiSort | undefined;
}

export interface Category {
  id: string;
  slug: string;
  nameAr: string;
  descriptionAr: string | null;
  imageUrl: string | null;
  status: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type MediaType = "IMAGE" | "VIDEO";

export interface ProductMedia {
  id: string;
  productId: string;
  type: MediaType;
  url: string;
  altAr: string | null;
  sortOrder: number;
  moderationStatus: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface ProductSpecification {
  id: string;
  productId: string;
  nameAr: string;
  valueAr: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  slug: string;
  brandId: string;
  categoryId: string;
  nameAr: string;
  summaryAr: string | null;
  descriptionAr: string | null;
  priceMin: string | null;
  priceMax: string | null;
  currency: string | null;
  status: string;
  ratingAverage: string | null;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  brand: Brand;
  category: Category;
  media?: ProductMedia[];
  specifications?: ProductSpecification[];
}

export interface PublicProfile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio: string | null;
  city: string | null;
  avatarUrl: string | null;
  visibility: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user?: {
    id: string;
    role: string;
    createdAt: string;
  };
}

export interface PublicUser {
  id: string;
  phone?: string;
  role: string;
  status?: string;
  lastSeenAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  profile: PublicProfile | null;
}

export interface PostMedia {
  id: string;
  postId: string;
  type: MediaType;
  url: string;
  altAr: string | null;
  sortOrder: number;
  moderationStatus: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface PostPoint {
  id: string;
  postId: string;
  body: string;
  sortOrder: number;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  productId: string;
  publicListId: string | null;
  rating: number;
  title: string;
  body: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  author: PublicUser;
  product: Product;
  publicList?: PublicList | null;
  media?: PostMedia[];
  pros?: PostPoint[];
  cons?: PostPoint[];
  _count?: {
    comments?: number;
  };
}

export interface Comment {
  id: string;
  authorId: string;
  targetType: "POST" | "PRODUCT";
  postId: string | null;
  productId: string | null;
  parentId: string | null;
  body: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  author: PublicUser;
  replies?: Comment[];
}

export type PublicListPurpose = "PUBLISHER_PUBLIC" | "PERSONAL_SAVE";
export type PublicListVisibility = "PUBLIC" | "PRIVATE";
export type PublicListItemTargetType = "POST" | "PRODUCT";

export interface PublicListItem {
  id: string;
  listId: string;
  targetType: PublicListItemTargetType;
  targetId: string;
  sortOrder: number;
  createdAt: string;
}

export interface PublicList {
  id: string;
  ownerId: string;
  slug: string;
  title: string;
  description: string | null;
  purpose: PublicListPurpose;
  visibility: PublicListVisibility;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  owner: PublicUser;
  items: PublicListItem[];
}

export interface PublicListDetails {
  list: PublicList;
  posts: Post[];
  products: Product[];
}
