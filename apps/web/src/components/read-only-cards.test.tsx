import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it } from "vitest";

import type { Category, Product, Post } from "@raina/api-contracts";

import { ApiErrorState } from "./state-views";
import { CategoryCard } from "./category-card";
import { PaginationControls } from "./pagination-controls";
import { ProductCard } from "./product-card";
import { PostCard } from "./post-card";
import { RatingSummary } from "./rating-summary";
import { RemoteImage } from "./remote-image";
import { RoundedCategoryCarousel } from "./rounded-category-carousel";
import { RainaApiError } from "@/lib/api/errors";

const category: Category = {
  id: "cat_skincare",
  slug: "skincare",
  nameAr: "العناية بالبشرة",
  descriptionAr: "منتجات يومية",
  imageUrl: null,
  status: "ACTIVE",
  sortOrder: 1,
  createdAt: "2026-06-23T00:00:00.000Z",
  updatedAt: "2026-06-23T00:00:00.000Z"
};

const brand = {
  id: "brd_01",
  slug: "luma",
  name: "لوما",
  description: null,
  status: "ACTIVE",
  createdAt: "2026-06-23T00:00:00.000Z",
  updatedAt: "2026-06-23T00:00:00.000Z"
};

const product: Product = {
  id: "prd_01",
  slug: "product-01",
  brandId: brand.id,
  categoryId: category.id,
  nameAr: "سيروم يومي",
  summaryAr: "منتج مناسب للروتين اليومي",
  descriptionAr: "وصف المنتج",
  priceMin: "42",
  priceMax: "58",
  currency: "SAR",
  status: "ACTIVE",
  ratingAverage: "8.5",
  ratingCount: 12,
  createdAt: "2026-06-23T00:00:00.000Z",
  updatedAt: "2026-06-23T00:00:00.000Z",
  deletedAt: null,
  brand,
  category,
  media: [],
  specifications: []
};

const post: Post = {
  id: "pst_01",
  authorId: "usr_01",
  productId: product.id,
  publicListId: null,
  rating: 8,
  title: "تجربة واضحة",
  body: "تجربة مفصلة تساعد على اتخاذ قرار أفضل.",
  status: "PUBLISHED",
  publishedAt: "2026-06-23T00:00:00.000Z",
  createdAt: "2026-06-23T00:00:00.000Z",
  updatedAt: "2026-06-23T00:00:00.000Z",
  deletedAt: null,
  author: {
    id: "usr_01",
    role: "USER",
    createdAt: "2026-06-23T00:00:00.000Z",
    profile: {
      id: "prf_01",
      userId: "usr_01",
      username: "rana",
      displayName: "رنا العبدالله",
      bio: null,
      city: "جدة",
      avatarUrl: null,
      visibility: "PUBLIC",
      createdAt: "2026-06-23T00:00:00.000Z",
      updatedAt: "2026-06-23T00:00:00.000Z",
      deletedAt: null
    }
  },
  product,
  media: [],
  pros: [
    {
      id: "pro_01",
      postId: "pst_01",
      body: "سهل الاستخدام",
      sortOrder: 1,
      createdAt: "2026-06-23T00:00:00.000Z"
    }
  ],
  cons: [],
  _count: { comments: 3 }
};

describe("read-only web cards", () => {
  it("renders category card with read-only link", () => {
    const html = renderToStaticMarkup(createElement(CategoryCard, { category }));

    expect(html).toContain("العناية بالبشرة");
    expect(html).toContain("/categories/skincare");
  });

  it("renders rounded category carousel without detailed card action", () => {
    const html = renderToStaticMarkup(
      createElement(RoundedCategoryCarousel, { categories: [category] })
    );

    expect(html).toContain("web-category-carousel__image");
    expect(html).toContain("/categories/skincare");
    expect(html).not.toContain("عرض التصنيف");
  });

  it("renders product card details", () => {
    const html = renderToStaticMarkup(createElement(ProductCard, { product }));

    expect(html).toContain("سيروم يومي");
    expect(html).toContain("العناية بالبشرة");
    expect(html).toContain("٨٫٥");
    expect(html).toContain("/products/product-01");
  });

  it("renders rating summary distribution", () => {
    const html = renderToStaticMarkup(
      createElement(RatingSummary, {
        average: "8.5",
        count: 1,
        posts: [post]
      })
    );

    expect(html).toContain("ملخص التقييم");
    expect(html).toContain("8 من 10");
  });

  it("renders remote image fallback without a source", () => {
    const html = renderToStaticMarkup(
      createElement(RemoteImage, {
        alt: "صورة منتج",
        fallbackLabel: "منتج تجريبي"
      })
    );

    expect(html).toContain("منتج تجريبي");
  });

  it("renders pagination links", () => {
    const html = renderToStaticMarkup(
      createElement(PaginationControls, {
        path: "/products",
        params: { search: "سيروم" },
        meta: { page: 2, limit: 24, total: 60, totalPages: 3 }
      })
    );

    expect(html).toContain("page=1");
    expect(html).toContain("page=3");
  });

  it("renders post card without write controls", () => {
    const html = renderToStaticMarkup(createElement(PostCard, { post }));

    expect(html).toContain("تجربة واضحة");
    expect(html).toContain("رنا العبدالله");
    expect(html).toContain("3 تعليق");
    expect(html).toContain("/posts/pst_01");
  });

  it("renders api error state safely", () => {
    const html = renderToStaticMarkup(
      createElement(ApiErrorState, {
        error: new RainaApiError(503, {
          code: "API_OFFLINE",
          message: "تعذر الاتصال"
        })
      })
    );

    expect(html).toContain("تعذر تحميل البيانات");
    expect(html).toContain("تعذر الاتصال");
  });
});
