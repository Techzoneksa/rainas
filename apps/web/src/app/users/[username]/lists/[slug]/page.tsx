import type { Metadata } from "next";
import { EmptyState, Grid, Stack } from "@raina/ui";

import { PageHeader } from "@/components/page-header";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { ApiErrorState, NotFoundState } from "@/components/state-views";
import { isRainaApiError } from "@/lib/api/errors";
import { getPublicListBySlug } from "@/lib/api/lists";

export const dynamic = "force-dynamic";

interface PublicListPageProps {
  params: Promise<{ username: string; slug: string }>;
}

export async function generateMetadata({ params }: PublicListPageProps): Promise<Metadata> {
  const { username, slug } = await params;
  try {
    const details = await getPublicListBySlug(username, slug);
    return {
      title: `${details.list.title} | Raina — رأينا`,
      description: details.list.description ?? "قائمة ناشر عامة في رأينا."
    };
  } catch {
    return {
      title: "قائمة عامة | Raina — رأينا"
    };
  }
}

export default async function PublicListPage({ params }: PublicListPageProps) {
  const { username, slug } = await params;

  try {
    const details = await getPublicListBySlug(username, slug);

    return (
      <Stack gap="24">
        <PageHeader
          eyebrow="قائمة ناشر عامة"
          title={details.list.title}
          description={details.list.description ?? "قائمة عامة تعرض منشورات ومنتجات الناشر."}
          badge={details.list.owner.profile?.displayName}
        />
        <section className="web-section" aria-labelledby="list-posts">
          <PageHeader title="منشورات القائمة" />
          {details.posts.length > 0 ? (
            <Grid className="web-card-grid web-card-grid--posts" columns="3" gap="16">
              {details.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Grid>
          ) : (
            <EmptyState title="لا توجد منشورات في هذه القائمة" />
          )}
        </section>
        <section className="web-section" aria-labelledby="list-products">
          <PageHeader title="منتجات القائمة" />
          {details.products.length > 0 ? (
            <Grid className="web-card-grid web-card-grid--products" columns="3" gap="16">
              {details.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Grid>
          ) : (
            <EmptyState title="لا توجد منتجات في هذه القائمة" />
          )}
        </section>
      </Stack>
    );
  } catch (error) {
    if (isRainaApiError(error) && error.status === 404) {
      return <NotFoundState title="القائمة غير موجودة" />;
    }
    return <ApiErrorState error={error} />;
  }
}
