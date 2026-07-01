import Link from "next/link";
import { EmptyState } from "@raina/ui";

import { HeroSlider } from "@/components/hero-slider";
import { DiscoveryCircles } from "@/components/discovery-circles";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { DiscoveryCards } from "@/components/discovery-cards";
import { ApiErrorState } from "@/components/state-views";
import { listPosts } from "@/lib/api/posts";
import { listProducts } from "@/lib/api/products";
import {
  heroSlides,
  discoveryCircles,
  womenDiscoveryCards,
  beautyCards,
  fashionCards,
} from "@/lib/config/discovery";

export const dynamic = "force-dynamic";

function getSettledValue<T>(result: PromiseSettledResult<T>): T | undefined {
  return result.status === "fulfilled" ? result.value : undefined;
}

function getSettledError<T>(
  result: PromiseSettledResult<T>,
): unknown | undefined {
  return result.status === "rejected" ? result.reason : undefined;
}

export default async function Page() {
  const [postsResult, productsResult] = await Promise.allSettled([
    listPosts({ limit: 12 }),
    listProducts({ limit: 8, sort: "rating_desc" }),
  ]);

  const posts = getSettledValue(postsResult);
  const products = getSettledValue(productsResult);
  const postsError = getSettledError(postsResult);
  const productsError = getSettledError(productsResult);

  return (
    <main className="web-home">
      <HeroSlider slides={heroSlides} />

      <div className="web-home__inner">
        <section className="web-home-section" aria-label="اكتشفي">
          <DiscoveryCircles items={discoveryCircles} />
        </section>

        <section className="web-home-section" aria-labelledby="h-latest">
          <div className="web-section-header">
            <div>
              <h2 id="h-latest" className="web-section-header__title">
                أحدث التجارب
              </h2>
              <p className="web-section-header__desc">
                قراءات سريعة من تجارب منشورة عن منتجات حقيقية
              </p>
            </div>
            <Link href="/posts" className="web-section-header__action">
              عرض الكل
            </Link>
          </div>
          {postsError ? (
            <ApiErrorState error={postsError} />
          ) : posts && posts.data.length > 0 ? (
            <div className="web-social-cards-row">
              {posts.data.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="لا توجد تجارب منشورة"
              description="ستظهر التجارب هنا عند توفرها."
            />
          )}
        </section>

        <section className="web-home-section" aria-labelledby="h-women">
          <div className="web-section-header">
            <div>
              <h2 id="h-women" className="web-section-header__title">
                الأكثر تداولًا لدى البنات
              </h2>
              <p className="web-section-header__desc">
                تجارب ومنتجات يتكلم عنها المستخدمون في العطور، المكياج، العناية،
                والأزياء.
              </p>
            </div>
          </div>
          <DiscoveryCards cards={womenDiscoveryCards} />
        </section>

        <section className="web-home-section" aria-labelledby="h-beauty">
          <div className="web-section-header">
            <div>
              <h2 id="h-beauty" className="web-section-header__title">
                جمال وعطور
              </h2>
              <p className="web-section-header__desc">
                تجارب حقيقية حول العطور، المكياج، والعناية بالبشرة والشعر
              </p>
            </div>
            <Link
              href="/categories/beauty"
              className="web-section-header__action"
            >
              عرض الكل
            </Link>
          </div>
          <DiscoveryCards cards={beautyCards} />
        </section>

        <section className="web-home-section" aria-label="مساحة إعلانية">
          <div className="web-ad-banner">
            <span className="web-ad-banner__label">إعلان</span>
            <p className="web-ad-banner__text">مساحة إعلانية</p>
          </div>
        </section>

        <section className="web-home-section" aria-labelledby="h-fashion">
          <div className="web-section-header">
            <div>
              <h2 id="h-fashion" className="web-section-header__title">
                إكسسوارات وأزياء
              </h2>
              <p className="web-section-header__desc">
                شنط، أحذية، نظارات، مجوهرات، وفساتين بتقييمات دقيقة
              </p>
            </div>
            <Link
              href="/categories/fashion"
              className="web-section-header__action"
            >
              عرض الكل
            </Link>
          </div>
          <DiscoveryCards cards={fashionCards} />
        </section>

        {products && products.data.length > 0 ? (
          <section className="web-home-section" aria-labelledby="h-products">
            <div className="web-section-header">
              <div>
                <h2 id="h-products" className="web-section-header__title">
                  منتجات مختارة
                </h2>
                <p className="web-section-header__desc">
                  منتجات مرتبة حسب تقييمات المستخدمين
                </p>
              </div>
              <Link
                href="/products"
                className="web-section-header__action"
              >
                عرض الكل
              </Link>
            </div>
            {productsError ? (
              <ApiErrorState error={productsError} />
            ) : (
              <div className="web-products-carousel">
                {products.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        ) : null}

        {posts && posts.data.length > 0 ? (
          <section className="web-home-section" aria-labelledby="h-more">
            <div className="web-section-header">
              <div>
                <h2 id="h-more" className="web-section-header__title">
                  تجارب مقترحة
                </h2>
                <p className="web-section-header__desc">
                  تجارب إضافية قد تهمك
                </p>
              </div>
            </div>
            <div className="web-social-cards-row">
              {posts.data.slice(0, 6).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
