import type { Post } from "@raina/api-contracts";
import { Avatar, Badge, Inline } from "@raina/ui";

import { formatDate } from "@/lib/format";

import { RatingBadge } from "./rating-badge";
import { RemoteImage } from "./remote-image";

interface ReviewHeroProps {
  post: Post;
  media: { url: string; alt?: string }[];
  fallbackLabel: string;
  categorySlug?: string;
}

export function ReviewHero({ post, media, fallbackLabel, categorySlug }: ReviewHeroProps) {
  const profile = post.author.profile;
  const primaryMedia = media[0];

  return (
    <section className="web-review-hero">
      <div className="web-review-hero__media">
        <RemoteImage
          src={primaryMedia?.url}
          alt={primaryMedia?.alt ?? fallbackLabel}
          fallbackLabel={fallbackLabel}
          className="web-review-hero__img"
          sizes="(min-width: 1024px) 50vw, 100vw"
          categorySlug={categorySlug ?? post.product.category?.slug}
          categoryFallbackIndex={0}
        />
      </div>
      <div className="web-review-hero__content">
        <div className="web-review-hero__top">
          <RatingBadge value={post.rating} />
          <Badge>{post.product.category.nameAr}</Badge>
        </div>
        <h1 className="web-review-hero__title">{post.title}</h1>
        <Inline gap="8">
          <Badge variant="info">{post.product.nameAr}</Badge>
          {post.product.brand ? <Badge>{post.product.brand.name}</Badge> : null}
        </Inline>
        <div className="web-review-hero__author">
          <Avatar
            name={profile?.displayName ?? "ناشر رأينا"}
            imageUrl={profile?.avatarUrl ?? undefined}
          />
          <div className="web-review-hero__author-text">
            <strong>{profile?.displayName ?? "ناشر رأينا"}</strong>
            <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}