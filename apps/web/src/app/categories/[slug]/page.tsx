import type { Metadata } from "next";
import { EmptyState } from "@raina/ui";
import type { Post, Product } from "@raina/api-contracts";

import { CategoryHero } from "@/components/category-hero";
import { CategoryFilters } from "@/components/category-filters";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { ApiErrorState, NotFoundState } from "@/components/state-views";
import { getCategoryBySlug } from "@/lib/api/categories";
import { listProducts } from "@/lib/api/products";
import { listPosts } from "@/lib/api/posts";
import { isRainaApiError } from "@/lib/api/errors";

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

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    return {
      title: `${category.nameAr} | Raina — رأينا`,
      description: category.descriptionAr ?? "تصنيف منتجات في رأينا.",
    };
  } catch {
    return {
      title: "تصنيف | Raina — رأينا",
    };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const filters = await searchParams;

  try {
    const category = await getCategoryBySlug(slug);
    const productsData = await listProducts({ categoryId: category.id, limit: 50 });
    const postsData = await listPosts({ categoryId: category.id, limit: 10 });

    const products = productsData.data;
    const posts = postsData.data;

    const brands = Array.from(
      new Map(
        products
          .filter((p): p is Product & { brand: NonNullable<Product["brand"]> } => Boolean(p.brand))
          .map((p) => [p.brand.slug, p.brand]),
      ).values(),
    );
    const allPosts = await listPosts({ limit: 6 }).catch(() => ({ data: [] as Post[] }));
    const relatedPosts = allPosts.data
      .filter((p) => p.product.categoryId !== category.id)
      .slice(0, 4);

    const productCount = products.length;
    const postCount = posts.length;
    const avgRating =
      products.length > 0
        ? products.reduce((sum, p) => sum + Number(p.ratingAverage || 0), 0) / products.length
        : 0;

    let filteredProducts = [...products];

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

    const sortedPosts = [...posts].sort(
      (a, b) => Number(b.rating || 0) - Number(a.rating || 0),
    );
    const topRatedPosts = sortedPosts.slice(0, 4);

    return (
      <div className="web-cat-page">
        <CategoryHero
          category={category}
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
                <EmptyState title="لا توجد منتجات" description="جرب تغيير الفلاتر." />
              )}
            </section>

            {posts.length > 0 ? (
              <section className="web-cat-section" aria-labelledby="cat-posts-heading">
                <div className="web-cat-section__head">
                  <h2 id="cat-posts-heading">أحدث التجارب في هذا التصنيف</h2>
                </div>
                <div className="web-cat-posts-row">
                  {posts.slice(0, 6).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            ) : null}

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

            {relatedPosts.length > 0 ? (
              <section className="web-cat-section" aria-labelledby="cat-related-heading">
                <div className="web-cat-section__head">
                  <h2 id="cat-related-heading">تجارب مشابهة</h2>
                </div>
                <div className="web-cat-posts-row">
                  {relatedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    if (isRainaApiError(error) && error.status === 404) {
      return <NotFoundState title="التصنيف غير موجود" />;
    }
    return <ApiErrorState error={error} />;
  }
}
