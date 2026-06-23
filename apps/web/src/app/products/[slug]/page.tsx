import type { Metadata, Route } from "next";
import Link from "next/link";
import { Badge, Card, EmptyState, Grid, Inline, Stack } from "@raina/ui";

import { PageHeader } from "@/components/page-header";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { RatingSummary } from "@/components/rating-summary";
import { ApiErrorState, NotFoundState } from "@/components/state-views";
import { isRainaApiError } from "@/lib/api/errors";
import { getProductBySlug, listProductPosts, listProducts } from "@/lib/api/products";
import { formatPrice, formatRating } from "@/lib/format";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    return {
      title: `${product.nameAr} | Raina — رأينا`,
      description: product.summaryAr ?? product.descriptionAr ?? "تفاصيل منتج في رأينا."
    };
  } catch {
    return {
      title: "منتج | Raina — رأينا"
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);
    const [posts, related] = await Promise.all([
      listProductPosts(product.id, { limit: 100 }),
      listProducts({ categoryId: product.categoryId, limit: 6 })
    ]);
    const relatedProducts = related.data.filter((item) => item.id !== product.id).slice(0, 3);

    return (
      <Stack gap="24">
        <PageHeader
          eyebrow="منتج"
          title={product.nameAr}
          description={
            product.descriptionAr ?? product.summaryAr ?? "تفاصيل المنتج وتجارب المستخدمين."
          }
          badge={formatRating(product.ratingAverage)}
        />
        <Grid columns="2" gap="16">
          <Card title="بيانات المنتج">
            <dl className="web-detail-list">
              <div>
                <dt>العلامة</dt>
                <dd>{product.brand.name}</dd>
              </div>
              <div>
                <dt>التصنيف</dt>
                <dd>{product.category.nameAr}</dd>
              </div>
              <div>
                <dt>السعر التقريبي</dt>
                <dd>{formatPrice(product.priceMin, product.priceMax, product.currency)}</dd>
              </div>
            </dl>
            <Inline gap="8">
              <Badge variant="primary">{formatRating(product.ratingAverage)}</Badge>
              <Badge>{product.ratingCount} تجربة</Badge>
            </Inline>
          </Card>
          <RatingSummary
            average={product.ratingAverage}
            count={product.ratingCount}
            posts={posts.data}
          />
        </Grid>

        <section className="web-section" aria-labelledby="product-specs">
          <PageHeader title="المواصفات" />
          {product.specifications && product.specifications.length > 0 ? (
            <Grid columns="3" gap="12">
              {product.specifications.map((specification) => (
                <Card key={specification.id} title={specification.nameAr}>
                  {specification.valueAr}
                </Card>
              ))}
            </Grid>
          ) : (
            <EmptyState title="لا توجد مواصفات حاليا" />
          )}
        </section>

        <section className="web-section" aria-labelledby="product-posts">
          <PageHeader title="تجارب المستخدمين" description="تجارب منشورة عن هذا المنتج." />
          {posts.data.length > 0 ? (
            <Grid columns="3" gap="16">
              {posts.data.slice(0, 6).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Grid>
          ) : (
            <EmptyState title="لا توجد تجارب بعد" />
          )}
        </section>

        <section className="web-section" aria-labelledby="related-products">
          <PageHeader title="منتجات مشابهة" />
          {relatedProducts.length > 0 ? (
            <Grid columns="3" gap="16">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </Grid>
          ) : (
            <EmptyState title="لا توجد منتجات مشابهة حاليا" />
          )}
        </section>
        <Link className="web-action" href={"/products" as Route}>
          العودة للمنتجات
        </Link>
      </Stack>
    );
  } catch (error) {
    if (isRainaApiError(error) && error.status === 404) {
      return <NotFoundState title="المنتج غير موجود" />;
    }
    return <ApiErrorState error={error} />;
  }
}
