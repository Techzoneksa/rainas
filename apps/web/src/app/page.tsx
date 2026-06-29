import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { EmptyState, Stack, Grid } from "@raina/ui";

import { PageHeader } from "@/components/page-header";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { HeroSlider } from "@/components/hero-slider";
import { DiscoveryCircles } from "@/components/discovery-circles";
import { SectionCarousel, SectionCarouselItem } from "@/components/section-carousel";
import { ApiErrorState } from "@/components/state-views";
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
  const [postsResult, productsResult] = await Promise.allSettled([
    listPosts({ limit: 8 }),
    listProducts({ limit: 8, sort: "rating_desc" })
  ]);

  const posts = getSettledValue(postsResult);
  const products = getSettledValue(productsResult);
  const postsError = getSettledError(postsResult);
  const productsError = getSettledError(productsResult);

  return (
    <Stack className="web-home" gap="0">
      <HeroSlider slides={heroSlides} />

      <div className="web-home__sections">
        <section className="web-section" aria-labelledby="home-discovery">
          <DiscoveryCircles items={discoveryCircles} />
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
            <PageHeader
              titleId={section.id}
              title={section.title}
              description={section.description}
            />
            <SectionCarousel ariaLabel={section.title}>
              {section.circles.map((item) => (
                <SectionCarouselItem key={item.id}>
                  <Link href={item.href as Route} className="web-discovery-card">
                    <div className="web-discovery-card__media">
                      <Image
                        src={item.imageUrl}
                        alt={item.nameAr}
                        fill
                        sizes="(min-width: 1024px) 320px, 280px"
                        className="web-discovery-card__image"
                        unoptimized
                      />
                    </div>
                    <div className="web-discovery-card__body">
                      <h3 className="web-discovery-card__title">{item.nameAr}</h3>
                      <span className="web-discovery-card__action">استكشف</span>
                    </div>
                  </Link>
                </SectionCarouselItem>
              ))}
            </SectionCarousel>
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
