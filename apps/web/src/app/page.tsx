import type { Route } from "next";
import Link from "next/link";
import { EmptyState, Grid, Inline, Stack } from "@raina/ui";

import { CategoryCard } from "@/components/category-card";
import { PageHeader } from "@/components/page-header";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { ApiErrorState } from "@/components/state-views";
import { listCategories } from "@/lib/api/categories";
import { listPosts } from "@/lib/api/posts";
import { listProducts } from "@/lib/api/products";

export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    const [categories, posts, products] = await Promise.all([
      listCategories({ limit: 8 }),
      listPosts({ limit: 6 }),
      listProducts({ limit: 6, sort: "rating_desc" })
    ]);

    return (
      <Stack gap="32">
        <section className="web-hero" aria-labelledby="home-title">
          <span className="web-eyebrow">Raina — رأينا</span>
          <h1 id="home-title">رأينا — تجارب حقيقية تساعدك تختار بثقة</h1>
          <p>اكتشف المنتجات من خلال تجارب المستخدمين وتقييماتهم من 10.</p>
          <Inline gap="8">
            <Link className="web-action web-action--primary" href={"/products" as Route}>
              استكشف المنتجات
            </Link>
            <Link className="web-action" href={"/posts" as Route}>
              اقرأ التجارب
            </Link>
          </Inline>
        </section>

        <section className="web-section" aria-labelledby="home-categories">
          <PageHeader title="التصنيفات" description="ابدأ من المجال الذي يهمك." />
          {categories.data.length > 0 ? (
            <Grid columns="4" gap="16">
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
          {posts.data.length > 0 ? (
            <Grid columns="3" gap="16">
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
          {products.data.length > 0 ? (
            <Grid columns="3" gap="16">
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
  } catch (error) {
    return <ApiErrorState error={error} />;
  }
}
