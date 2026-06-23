import type { Metadata, Route } from "next";
import Link from "next/link";
import { Avatar, Badge, Card, EmptyState, Grid, Inline, Stack } from "@raina/ui";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageHeader } from "@/components/page-header";
import { ApiErrorState, NotFoundState } from "@/components/state-views";
import { isRainaApiError } from "@/lib/api/errors";
import { getPostById, listPostComments } from "@/lib/api/posts";
import { formatDate, formatPrice, formatRating } from "@/lib/format";

export const dynamic = "force-dynamic";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await getPostById(id);
    return {
      title: `${post.title} | Raina — رأينا`,
      description: post.body
    };
  } catch {
    return {
      title: "منشور | Raina — رأينا"
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  try {
    const post = await getPostById(id);
    const comments = await listPostComments(post.id, { limit: 50 });
    const profile = post.author.profile;

    return (
      <Stack gap="24">
        <PageHeader
          eyebrow="تجربة"
          title={post.title}
          description={post.body}
          badge={formatRating(post.rating)}
        />
        <Card>
          <Stack gap="16">
            <Inline gap="12" align="center">
              <Avatar
                name={profile?.displayName ?? "ناشر رأينا"}
                imageUrl={profile?.avatarUrl ?? undefined}
              />
              <Stack gap="4">
                <strong>{profile?.displayName ?? "ناشر رأينا"}</strong>
                <span className="web-muted">{formatDate(post.publishedAt ?? post.createdAt)}</span>
              </Stack>
            </Inline>
            {post.media?.map((media) => (
              <MediaPlaceholder
                key={media.id}
                label={media.altAr ?? post.title}
                type={media.type}
              />
            ))}
            <Inline gap="8">
              <Badge variant="primary">{formatRating(post.rating)}</Badge>
              <Badge>{post.product.nameAr}</Badge>
              <Badge variant="info">{post.product.brand.name}</Badge>
            </Inline>
            <dl className="web-detail-list">
              <div>
                <dt>السعر ومكان الشراء</dt>
                <dd>
                  {formatPrice(post.product.priceMin, post.product.priceMax, post.product.currency)}
                </dd>
              </div>
              <div>
                <dt>المنتج</dt>
                <dd>
                  <Link className="web-link" href={`/products/${post.product.slug}` as Route}>
                    {post.product.nameAr}
                  </Link>
                </dd>
              </div>
            </dl>
          </Stack>
        </Card>

        <Grid columns="2" gap="16">
          <Card title="الإيجابيات">
            {post.pros && post.pros.length > 0 ? (
              <ul className="web-point-list">
                {post.pros.map((point) => (
                  <li key={point.id}>{point.body}</li>
                ))}
              </ul>
            ) : (
              <EmptyState title="لا توجد إيجابيات مدونة" />
            )}
          </Card>
          <Card title="الملاحظات">
            {post.cons && post.cons.length > 0 ? (
              <ul className="web-point-list">
                {post.cons.map((point) => (
                  <li key={point.id}>{point.body}</li>
                ))}
              </ul>
            ) : (
              <EmptyState title="لا توجد ملاحظات مدونة" />
            )}
          </Card>
        </Grid>

        <section className="web-section" aria-labelledby="post-comments">
          <PageHeader title="التعليقات" description="تعليقات قراءة فقط في هذه المرحلة." />
          {comments.data.length > 0 ? (
            <Stack gap="12">
              {comments.data.map((comment) => (
                <Card key={comment.id}>
                  <Inline gap="8" align="center">
                    <Avatar
                      name={comment.author.profile?.displayName ?? "مستخدم رأينا"}
                      imageUrl={comment.author.profile?.avatarUrl ?? undefined}
                    />
                    <strong>{comment.author.profile?.displayName ?? "مستخدم رأينا"}</strong>
                  </Inline>
                  <p>{comment.body}</p>
                </Card>
              ))}
            </Stack>
          ) : (
            <EmptyState title="لا توجد تعليقات بعد" />
          )}
        </section>
      </Stack>
    );
  } catch (error) {
    if (isRainaApiError(error) && error.status === 404) {
      return <NotFoundState title="المنشور غير موجود" />;
    }
    return <ApiErrorState error={error} />;
  }
}
