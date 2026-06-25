import type { Route } from "next";
import Link from "next/link";
import type { Product } from "@raina/api-contracts";
import { EmptyState, Stack } from "@raina/ui";

import { PageHeader } from "@/components/page-header";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { RemoteImage } from "@/components/remote-image";
import { RoundedCategoryCarousel } from "@/components/rounded-category-carousel";
import { SectionCarousel, SectionCarouselItem } from "@/components/section-carousel";
import { ApiErrorState } from "@/components/state-views";
import { listCategories } from "@/lib/api/categories";
import { listPosts } from "@/lib/api/posts";
import { listProducts } from "@/lib/api/products";
import { formatCount } from "@/lib/format";

export const dynamic = "force-dynamic";

function getSettledValue<T>(result: PromiseSettledResult<T>): T | undefined {
  return result.status === "fulfilled" ? result.value : undefined;
}

function getSettledError<T>(result: PromiseSettledResult<T>): unknown | undefined {
  return result.status === "rejected" ? result.reason : undefined;
}

function HomeHeroStats({
  categoryCount,
  postCount,
  productCount
}: {
  categoryCount: number;
  postCount: number;
  productCount: number;
}) {
  return (
    <div className="web-hero-stats">
      <div className="web-hero-stats__item">
        <strong className="web-hero-stats__value">
          {productCount > 0 ? formatCount(productCount, "") : "..."}
        </strong>
        <span className="web-hero-stats__label">منتج</span>
      </div>
      <div className="web-hero-stats__item">
        <strong className="web-hero-stats__value">
          {postCount > 0 ? formatCount(postCount, "") : "..."}
        </strong>
        <span className="web-hero-stats__label">تجربة</span>
      </div>
      <div className="web-hero-stats__item">
        <strong className="web-hero-stats__value">
          {categoryCount > 0 ? formatCount(categoryCount, "") : "..."}
        </strong>
        <span className="web-hero-stats__label">تصنيف</span>
      </div>
      <div className="web-hero-stats__item">
        <strong className="web-hero-stats__value">10</strong>
        <span className="web-hero-stats__label">تقييم من</span>
      </div>
    </div>
  );
}

function HomeHero({
  products,
  categoryCount,
  postCount,
  productCount
}: {
  products: Product[];
  categoryCount: number;
  postCount: number;
  productCount: number;
}) {
  const heroProducts = products.slice(0, 3);

  return (
    <section className="web-hero" aria-labelledby="home-title">
      <div className="web-hero__content">
        <h1 id="home-title">رأينا — تجارب حقيقية تساعدك تختار بثقة</h1>
        <p className="web-hero__description">
          اكتشف المنتجات من خلال تجارب المستخدمين وتقييماتهم من 10.
        </p>
        <div className="web-hero__actions">
          <Link className="web-action web-action--primary" href={"/products" as Route}>
            استكشف المنتجات
          </Link>
          <Link className="web-action" href={"/posts" as Route}>
            اقرأ التجارب
          </Link>
        </div>
        <HomeHeroStats
          categoryCount={categoryCount}
          postCount={postCount}
          productCount={productCount}
        />
      </div>
      <div className="web-hero__visual" aria-label="لمحة عن محتوى رأينا">
        <div className="web-hero__media-grid">
          {heroProducts.length > 0 ? (
            heroProducts.map((product) => {
              const media = product.media?.[0];
              return (
                <RemoteImage
                  key={product.id}
                  src={media?.url}
                  alt={media?.altAr ?? `صورة ${product.nameAr}`}
                  fallbackLabel={product.nameAr}
                  className="web-hero__image"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 34vw, 50vw"
                />
              );
            })
          ) : (
            <RemoteImage
              alt="واجهة رأينا"
              fallbackLabel="رأينا"
              className="web-hero__image web-hero__image--wide"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default async function Page() {
  const [categoriesResult, postsResult, productsResult] = await Promise.allSettled([
    listCategories({ limit: 8 }),
    listPosts({ limit: 8 }),
    listProducts({ limit: 8, sort: "rating_desc" })
  ]);

  const categories = getSettledValue(categoriesResult);
  const posts = getSettledValue(postsResult);
  const products = getSettledValue(productsResult);
  const categoriesError = getSettledError(categoriesResult);
  const postsError = getSettledError(postsResult);
  const productsError = getSettledError(productsResult);

  return (
    <Stack className="web-home" gap="40">
      <HomeHero
        products={products?.data ?? []}
        categoryCount={categories?.meta.total ?? categories?.data.length ?? 0}
        postCount={posts?.meta.total ?? posts?.data.length ?? 0}
        productCount={products?.meta.total ?? products?.data.length ?? 0}
      />

      <section className="web-section" aria-labelledby="home-categories">
        <PageHeader
          titleId="home-categories"
          title="تصفح حسب التصنيف"
          description="اختر المجال الذي يهمك."
        />
        {categoriesError ? (
          <ApiErrorState error={categoriesError} />
        ) : categories && categories.data.length > 0 ? (
          <RoundedCategoryCarousel categories={categories.data} />
        ) : (
          <EmptyState
            title="لا توجد تصنيفات حاليا"
            description="ستظهر التصنيفات هنا عند توفرها من API."
          />
        )}
      </section>

      <section className="web-section" aria-labelledby="home-posts">
        <PageHeader
          titleId="home-posts"
          title="أحدث التجارب"
          description="قراءات سريعة من تجارب منشورة."
        />
        {postsError ? (
          <ApiErrorState error={postsError} />
        ) : posts && posts.data.length > 0 ? (
          <SectionCarousel ariaLabel="أحدث التجارب">
            {posts.data.map((post) => (
              <SectionCarouselItem key={post.id}>
                <PostCard post={post} />
              </SectionCarouselItem>
            ))}
          </SectionCarousel>
        ) : (
          <EmptyState title="لا توجد تجارب بعد" />
        )}
      </section>

      <section className="web-section" aria-labelledby="home-products">
        <PageHeader
          titleId="home-products"
          title="منتجات مختارة"
          description="منتجات مرتبة حسب التقييمات المتاحة."
        />
        {productsError ? (
          <ApiErrorState error={productsError} />
        ) : products && products.data.length > 0 ? (
          <SectionCarousel ariaLabel="منتجات مختارة">
            {products.data.map((product) => (
              <SectionCarouselItem key={product.id}>
                <ProductCard product={product} />
              </SectionCarouselItem>
            ))}
          </SectionCarousel>
        ) : (
          <EmptyState title="لا توجد منتجات حاليا" />
        )}
      </section>
    </Stack>
  );
}
