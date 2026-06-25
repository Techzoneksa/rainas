import type { Route } from "next";
import Link from "next/link";
import type { Post } from "@raina/api-contracts";
import { Avatar, Badge, Card, Inline, Stack } from "@raina/ui";

import { excerpt, formatDate } from "@/lib/format";

import { RatingBadge } from "./rating-badge";
import { RemoteImage } from "./remote-image";

export function PostCard({ post }: Readonly<{ post: Post }>) {
  const profile = post.author.profile;
  const media = post.media?.[0] ?? post.product.media?.[0];

  return (
    <Card
      className="web-content-card web-content-card--post"
      title={post.title}
      description={excerpt(post.body)}
      variant="interactive"
      footer={
        <Link className="web-link" href={`/posts/${post.id}` as Route}>
          قراءة التجربة
        </Link>
      }
    >
      <Stack gap="12">
        <Inline gap="8" align="center">
          <Avatar
            name={profile?.displayName ?? "ناشر رأينا"}
            imageUrl={profile?.avatarUrl ?? undefined}
          />
          <div className="web-post-author">
            <strong>{profile?.displayName ?? "ناشر رأينا"}</strong>
            <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
          </div>
        </Inline>
        <RemoteImage
          src={media?.url}
          alt={media?.altAr ?? `صورة ${post.title}`}
          fallbackLabel={post.product.nameAr}
          className="web-post-card__media"
        />
        <Inline gap="8" justify="start">
          <RatingBadge value={post.rating} />
          <Badge>{post.product.nameAr}</Badge>
          <Badge variant="info">{post.product.category.nameAr}</Badge>
        </Inline>
        {post.pros && post.pros.length > 0 ? (
          <ul className="web-point-list">
            {post.pros.slice(0, 1).map((point) => (
              <li key={point.id}>{point.body}</li>
            ))}
          </ul>
        ) : null}
        <span className="web-muted">{post._count?.comments ?? 0} تعليق</span>
      </Stack>
    </Card>
  );
}
