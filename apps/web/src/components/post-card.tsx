import type { Route } from "next";
import Link from "next/link";
import type { Post } from "@raina/api-contracts";
import { Avatar, Badge } from "@raina/ui";

import { excerpt, formatDate } from "@/lib/format";

import { RatingBadge } from "./rating-badge";
import { RemoteImage } from "./remote-image";

export function PostCard({ post }: Readonly<{ post: Post }>) {
  const profile = post.author.profile;
  const media = post.media?.[0] ?? post.product.media?.[0];
  const categorySlug = post.product.category?.slug;

  return (
    <article className="web-social-card">
      <Link href={`/posts/${post.id}` as Route} className="web-social-card__link">
        <div className="web-social-card__media">
          <RemoteImage
            src={media?.url}
            alt={media?.altAr ?? post.title}
            fallbackLabel={post.product.nameAr}
            className="web-social-card__image"
            categorySlug={categorySlug}
            categoryFallbackIndex={0}
          />
        </div>
        <div className="web-social-card__body">
          <div className="web-social-card__meta">
            <RatingBadge value={post.rating} />
            <Badge>{post.product.category.nameAr}</Badge>
            {post.product.brand ? (
              <Badge variant="neutral">{post.product.brand.name}</Badge>
            ) : null}
          </div>
          <h3 className="web-social-card__title">{post.title}</h3>
          <p className="web-social-card__excerpt">{excerpt(post.body, 80)}</p>
          <div className="web-social-card__author">
            <Avatar
              size="sm"
              name={profile?.displayName ?? "ناشر رأينا"}
              imageUrl={profile?.avatarUrl ?? undefined}
            />
            <span className="web-social-card__author-name">
              {profile?.displayName ?? "ناشر رأينا"}
            </span>
            <span className="web-social-card__date">
              {formatDate(post.publishedAt ?? post.createdAt)}
            </span>
          </div>
          <span className="web-social-card__action">عرض التجربة</span>
        </div>
      </Link>
    </article>
  );
}
