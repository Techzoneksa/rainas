import type { Route } from "next";
import Link from "next/link";
import type { Category, Post, Product } from "@raina/api-contracts";
import { Badge, EmptyState, Grid, Inline, Stack } from "@raina/ui";

import { CategoryCard } from "@/components/category-card";
import { PageHeader } from "@/components/page-header";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { RemoteImage } from "@/components/remote-image";
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

function HomeHero({
  categories,
  posts,
  products,
  categoryCount,
  postCount,
  productCount
}: Readonly<{
  categories: Category[];
  posts: Post[];
  products: Product[];
  categoryCount: number;
  postCount: number;
  productCount: number;
}>) {
  const heroProducts = products.slice(0, 3);

  return (
    <section className="web-hero" aria-labelledby="home-title">
      <div className="web-hero__content">
        <span className="web-eyebrow">Raina — رأينا</span>
        <h1 id="home-title">تجارب حقيقية تساعدك تختار بثقة</h1>
        <p>
          اقرأ تقييمات من 10، تصفح المنتجات حسب التصنيف، وشاهد تجارب المستخدمين داخل واجهة عربية
          مهيأة للجوال والتابلت وسطح المكتب.
        </p>
        <Inline className="web-hero__actions" gap="8">
          <Link className="web-action web-action--primary" href={"/products" as Route}>
            استكشف المنتجات
          </Link>
          <Link className="web-action" href={"/posts" as Route}>
            اقرأ التجارب
          </Link>
        </Inline>
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
        <div className="web-hero__stats">
          <Badge variant="primary">
            {productCount > 0 ? formatCount(productCount, "منتج") : "منتجات وتجارب"}
          </Badge>
          <Badge variant="info">
            {postCount > 0 ? formatCount(postCount, "تجربة") : "تقييمات من 10"}
          </Badge>
          <Badge>
            {categoryCount > 0 ? formatCount(categoryCount, "تصنيف") : "تصنيفات متنوعة"}
          </Badge>
          {categories[0] ? <Badge variant="purple">{categories[0].nameAr}</Badge> : null}
          {posts[0] ? <Badge variant="success">آخر تجربة منشورة</Badge> : null}
        </div>
      </div>
    </section>
  );
}

export default async function Page() {
  const [categoriesResult, postsResult, productsResult] = await Promise.allSettled([
    listCategories({ limit: 8 }),
    listPosts({ limit: 6 }),
    listProducts({ limit: 6, sort: "rating_desc" })
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
        categories={categories?.data ?? []}
        posts={posts?.data ?? []}
        products={products?.data ?? []}
        categoryCount={categories?.meta.total ?? categories?.data.length ?? 0}
        postCount={posts?.meta.total ?? posts?.data.length ?? 0}
        productCount={products?.meta.total ?? products?.data.length ?? 0}
      />

      <section className="web-section" aria-labelledby="home-categories">
        <PageHeader title="التصنيفات" description="ابدأ من المجال الذي يهمك." />
        {categoriesError ? (
          <ApiErrorState error={categoriesError} />
        ) : categories && categories.data.length > 0 ? (
          <Grid className="web-card-grid web-card-grid--categories" columns="4" gap="16">
            {categories.data.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </Grid>
        ) : (
          <EmptyState title="لا توجد تصنيفات حاليا" />
        )}
      </section>

      <section className="web-section" aria-labelledby="home-posts">
        <PageHeader title="أحدث التجارب" description="قراءات سريعة من تجارب منشورة." />
        {postsError ? (
          <ApiErrorState error={postsError} />
        ) : posts && posts.data.length > 0 ? (
          <Grid className="web-card-grid web-card-grid--posts" columns="3" gap="16">
            {posts.data.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Grid>
        ) : (
          <EmptyState title="لا توجد تجارب بعد" />
        )}
      </section>

      <section className="web-section" aria-labelledby="home-products">
        <PageHeader title="منتجات مختارة" description="منتجات مرتبة حسب التقييمات المتاحة." />
        {productsError ? (
          <ApiErrorState error={productsError} />
        ) : products && products.data.length > 0 ? (
          <Grid className="web-card-grid web-card-grid--products" columns="3" gap="16">
            {products.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        ) : (
          <EmptyState title="لا توجد منتجات حاليا" />
        )}
      </section>
    </Stack>
  );
}
