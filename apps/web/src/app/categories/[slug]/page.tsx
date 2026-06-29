import type { Metadata } from "next";
import { EmptyState } from "@raina/ui";
import type { Post, Product } from "@raina/api-contracts";

import { CategoryHero } from "@/components/category-hero";
import { CategoryFilters } from "@/components/category-filters";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";

import { getCategoryBySlug } from "@/lib/api/categories";
import { listProducts } from "@/lib/api/products";
import { listPosts } from "@/lib/api/posts";
import { isRainaApiError } from "@/lib/api/errors";
import {
  getVisualByUrlSlug,
  productMatchesCategory,
  postMatchesCategory,
  getDemoProductsForCategory,
  getDemoPostsForCategory,
  type DemoProduct,
  type DemoPost,
} from "@/lib/category-visuals";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    q?: string;
    rating?: string;
    type?: string;
    brand?: string;
    price?: string;
    sort?: string;
  }>;
}

const sortOptions = [
  { value: "rating_desc", label: "الأعلى تقييمًا" },
  { value: "created_desc", label: "الأحدث" },
  { value: "created_asc", label: "الأقدم" },
];

function logDebug(urlSlug: string, message: string, data?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "development") {
    const visual = getVisualByUrlSlug(urlSlug);
    console.log(`[CategoryDebug] ${urlSlug} -> ${visual?.nameAr ?? "unknown"}: ${message}`, data ?? "");
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const visual = getVisualByUrlSlug(slug);
  return {
    title: `${visual?.nameAr ?? "تصنيف"} | Raina — رأينا`,
    description: visual?.descriptionAr ?? "تصنيف منتجات في رأينا.",
  };
}

function filterProductsByCategory(products: Product[], urlSlug: string): Product[] {
  return products.filter((p) => productMatchesCategory(p.nameAr, urlSlug));
}

function filterPostsByCategory(posts: Post[], urlSlug: string): Post[] {
  return posts.filter((p) => {
    const productName = p.product?.nameAr ?? "";
    const postTitle = p.title ?? "";
    const postBody = p.body ?? "";
    return postMatchesCategory(postTitle, postBody, productName, urlSlug);
  });
}

function createDemoProductCard(demo: DemoProduct) {
  return {
    id: demo.id,
    slug: demo.id,
    nameAr: demo.nameAr,
    summaryAr: demo.summaryAr,
    priceMin: demo.priceMin,
    priceMax: demo.priceMax,
    ratingAverage: demo.ratingAverage,
    media: demo.media,
    brand: demo.brand,
    category: demo.category,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as Product;
}

function createDemoPostCard(demo: DemoPost) {
  return {
    id: demo.id,
    title: demo.title,
    body: demo.body,
    rating: demo.rating,
    media: demo.media,
    author: demo.author,
    product: demo.product,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as Post;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const filters = await searchParams;
  const urlSlug = slug.toLowerCase().trim();

  const visual = getVisualByUrlSlug(urlSlug);
  const categoryNameAr = visual?.nameAr ?? "تصنيف";

  logDebug(urlSlug, "Page requested");

  let apiCategory = null;
  try {
    apiCategory = await getCategoryBySlug(slug);
    logDebug(urlSlug, "API category found", { nameAr: apiCategory.nameAr, id: apiCategory.id });
  } catch (error) {
    if (isRainaApiError(error) && error.status === 404) {
      logDebug(urlSlug, "API category not found, using visual fallback");
    }
  }

  let apiProducts: Product[] = [];
  let apiPosts: Post[] = [];

  if (apiCategory) {
    try {
      const productsData = await listProducts({ categoryId: apiCategory.id, limit: 50 });
      apiProducts = productsData.data;
      logDebug(urlSlug, "API products fetched", { count: apiProducts.length });
    } catch (e) {
      logDebug(urlSlug, "API products fetch failed", { error: String(e) });
    }

    try {
      const postsData = await listPosts({ categoryId: apiCategory.id, limit: 10 });
      apiPosts = postsData.data;
      logDebug(urlSlug, "API posts fetched", { count: apiPosts.length });
    } catch (e) {
      logDebug(urlSlug, "API posts fetch failed", { error: String(e) });
    }
  }

  const categoryFilteredProducts = filterProductsByCategory(apiProducts, urlSlug);
  const categoryFilteredPosts = filterPostsByCategory(apiPosts, urlSlug);

  logDebug(urlSlug, "After category filtering", {
    apiProducts: apiProducts.length,
    filteredProducts: categoryFilteredProducts.length,
    apiPosts: apiPosts.length,
    filteredPosts: categoryFilteredPosts.length,
  });

  let finalProducts: Product[] = categoryFilteredProducts.length > 0 ? categoryFilteredProducts : [];
  let finalPosts: Post[] = categoryFilteredPosts.length > 0 ? categoryFilteredPosts : [];

  if (finalProducts.length === 0) {
    const demoProducts = getDemoProductsForCategory(urlSlug);
    finalProducts = demoProducts.map(createDemoProductCard);
    logDebug(urlSlug, "Using demo products", { count: finalProducts.length });
  }

  if (finalPosts.length === 0) {
    const demoPosts = getDemoPostsForCategory(urlSlug);
    finalPosts = demoPosts.map(createDemoPostCard);
    logDebug(urlSlug, "Using demo posts", { count: finalPosts.length });
  }

  const brands = Array.from(
    new Map(
      finalProducts
        .filter((p): p is Product & { brand: NonNullable<Product["brand"]> } => Boolean(p.brand))
        .map((p) => [p.brand.slug, p.brand]),
    ).values(),
  );

  let filteredProducts = [...finalProducts];

  if (filters.q) {
    const q = filters.q.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.nameAr.toLowerCase().includes(q) ||
        (p.summaryAr ?? "").toLowerCase().includes(q) ||
        (p.brand?.name ?? "").toLowerCase().includes(q),
    );
  }

  if (filters.rating) {
    const minRating = Number(filters.rating);
    filteredProducts = filteredProducts.filter(
      (p) => Number(p.ratingAverage || 0) >= minRating,
    );
  }

  if (filters.brand) {
    filteredProducts = filteredProducts.filter((p) => p.brand?.slug === filters.brand);
  }

  if (filters.price) {
    filteredProducts = filteredProducts.filter((p) => {
      const min = Number(p.priceMin || 0);
      const max = Number(p.priceMax || Infinity);
      if (filters.price === "0-100") return max <= 100;
      if (filters.price === "100-300") return min >= 100 && max <= 300;
      if (filters.price === "300-700") return min >= 300 && max <= 700;
      if (filters.price === "700+") return min >= 700;
      return true;
    });
  }

  if (filters.sort === "rating_desc") {
    filteredProducts.sort((a, b) => Number(b.ratingAverage || 0) - Number(a.ratingAverage || 0));
  } else if (filters.sort === "created_desc" || !filters.sort) {
    filteredProducts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else if (filters.sort === "created_asc") {
    filteredProducts.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  if (filters.type === "posts") {
    filteredProducts = [];
  }

  const sortedPosts = [...finalPosts].sort(
    (a, b) => Number(b.rating || 0) - Number(a.rating || 0),
  );
  const topRatedPosts = sortedPosts.slice(0, 4);

  const productCount = filteredProducts.length;
  const postCount = finalPosts.length;
  const avgRating =
    filteredProducts.length > 0
      ? filteredProducts.reduce((sum, p) => sum + Number(p.ratingAverage || 0), 0) / filteredProducts.length
      : 0;

  const displayCategory = apiCategory ?? {
    id: urlSlug,
    slug: urlSlug,
    nameAr: categoryNameAr,
    descriptionAr: visual?.descriptionAr ?? null,
    imageUrl: null,
    status: "active",
    sortOrder: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="web-cat-page">
      <CategoryHero
        category={displayCategory}
        urlSlug={urlSlug}
        productCount={productCount}
        postCount={postCount}
        avgRating={avgRating}
      />

      <div className="web-cat-page__layout">
        <CategoryFilters brands={brands} sortOptions={sortOptions} />

        <div className="web-cat-page__main">
          <section className="web-cat-section" aria-labelledby="cat-products-heading">
            <div className="web-cat-section__head">
              <h2 id="cat-products-heading">منتجات هذا التصنيف</h2>
              <span className="web-cat-section__count">{filteredProducts.length} منتج</span>
            </div>
            {filteredProducts.length > 0 ? (
              <div className="web-cat-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="لا توجد منتجات في هذا التصنيف حتى الآن"
                description="جرب تغيير الفلاتر أو تصفح التصنيفات الأخرى."
              />
            )}
          </section>

          {finalPosts.length > 0 ? (
            <section className="web-cat-section" aria-labelledby="cat-posts-heading">
              <div className="web-cat-section__head">
                <h2 id="cat-posts-heading">أحدث التجارب في هذا التصنيف</h2>
              </div>
              <div className="web-cat-posts-row">
                {finalPosts.slice(0, 6).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ) : (
            <section className="web-cat-section" aria-labelledby="cat-posts-heading">
              <div className="web-cat-section__head">
                <h2 id="cat-posts-heading">أحدث التجارب في هذا التصنيف</h2>
              </div>
              <EmptyState
                title="لا توجد تجارب في هذا التصنيف حتى الآن"
                description="كن أول من يشارك تجربتك مع هذا التصنيف."
              />
            </section>
          )}

          {topRatedPosts.length > 0 ? (
            <section className="web-cat-section" aria-labelledby="cat-top-heading">
              <div className="web-cat-section__head">
                <h2 id="cat-top-heading">الأعلى تقييمًا</h2>
              </div>
              <div className="web-cat-posts-row">
                {topRatedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}