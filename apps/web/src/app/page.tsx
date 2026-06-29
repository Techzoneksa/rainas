import Link from "next/link";
import { EmptyState, Stack, Grid } from "@raina/ui";

import { PageHeader } from "@/components/page-header";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { HeroSlider } from "@/components/hero-slider";
import { DiscoveryCircles } from "@/components/discovery-circles";
import { RoundedCategoryCarousel } from "@/components/rounded-category-carousel";
import { ApiErrorState } from "@/components/state-views";
import { listCategories } from "@/lib/api/categories";
import { listPosts } from "@/lib/api/posts";
import { listProducts } from "@/lib/api/products";
import { heroSlides, discoveryCircles, womenDiscoverySections } from "@/lib/config/discovery";

export const dynamic = "force-dynamic";

function getSettledValue<T>(result: PromiseSettledResult<T>): T | undefined {
  return result.status === "fulfilled" ? result.value : undefined;
}

function getSettledError<T>(result: PromiseSettledResult<T>): unknown | undefined {
  return result.status === "rejected" ? result.reason : undefined;
}

function AdBanner() {
  return (
    <section className="web-ad-banner" aria-label="مساحة إعلانية">
      <div className="web-ad-banner__inner">
        <span className="web-ad-banner__label">إعلان</span>
        <p className="web-ad-banner__text">مساحة إعلانية</p>
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
    <Stack className="web-home" gap="0">
      <HeroSlider slides={heroSlides} />

      <div className="web-home__sections">
        <section className="web-section" aria-labelledby="home-categories">
          <DiscoveryCircles items={discoveryCircles} />
        </section>

        <section className="web-section" aria-labelledby="home-categories-list">
          <PageHeader
            titleId="home-categories-list"
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
            action={
              <Link href="/posts" className="web-link">
                عرض الكل
              </Link>
            }
          />
          {postsError ? (
            <ApiErrorState error={postsError} />
          ) : posts && posts.data.length > 0 ? (
            <Grid className="web-card-grid web-card-grid--posts" columns="3" gap="16">
              {posts.data.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Grid>
          ) : (
            <EmptyState
              title="لا توجد تجارب منشورة"
              description="ستظهر التجارب هنا عند توفرها."
            />
          )}
        </section>

        <AdBanner />

        {womenDiscoverySections.map((section) => (
          <section key={section.id} className="web-section" aria-labelledby={section.id}>
            <DiscoveryCircles items={section.circles} title={section.title} description={section.description} />
          </section>
        ))}

        <section className="web-section" aria-labelledby="home-electronics">
          <PageHeader
            titleId="home-electronics"
            title="تجارب إلكترونيات"
            description="أحدث تقييمات الأجهزة الذكية والجوالات."
            action={
              <Link href="/categories/electronics" className="web-link">
                عرض الكل
              </Link>
            }
          />
          {posts && posts.data.length > 0 ? (
            <Grid className="web-card-grid web-card-grid--posts" columns="3" gap="16">
              {posts.data.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Grid>
          ) : null}
        </section>

        {products && products.data.length > 0 ? (
          <section className="web-section" aria-labelledby="home-products">
            <PageHeader
              titleId="home-products"
              title="منتجات مختارة"
              description="منتجات مرتبة حسب التقييمات المتاحة."
            />
            {productsError ? (
              <ApiErrorState error={productsError} />
            ) : (
              <Grid className="web-card-grid web-card-grid--products" columns="4" gap="16">
                {products.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Grid>
            )}
          </section>
        ) : null}
      </div>
    </Stack>
  );
}
