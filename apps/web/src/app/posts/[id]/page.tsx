import type { Metadata } from "next";
import type { Post } from "@raina/api-contracts";

import { ReviewHero } from "@/components/review-hero";
import { ProsConsSection } from "@/components/pros-cons-section";
import { ProductSummaryCard } from "@/components/product-summary-card";
import { CommentsSection } from "@/components/comments-section";
import { ReviewActions } from "@/components/review-actions";
import { RelatedReviews } from "@/components/related-reviews";
import { ApiErrorState, NotFoundState } from "@/components/state-views";
import { isRainaApiError } from "@/lib/api/errors";
import { getPostById, listPostComments, listPosts } from "@/lib/api/posts";

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
      description: post.body,
    };
  } catch {
    return {
      title: "منشور | Raina — رأينا",
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  try {
    const post = await getPostById(id);
    const comments = await listPostComments(post.id, { limit: 50 });
    const allPosts = await listPosts({ limit: 8 }).catch(() => ({ data: [] as Post[] }));

    const media =
      post.media && post.media.length > 0
        ? post.media.map((m) => ({ url: m.url, ...(m.altAr ? { alt: m.altAr } : {}) }))
        : post.product.media?.slice(0, 1).map((m) => ({ url: m.url, ...(m.altAr ? { alt: m.altAr } : {}) })) ?? [];

    const relatedPosts = allPosts.data
      .filter((p) => p.id !== post.id && p.product.categoryId === post.product.categoryId)
      .slice(0, 4);

    return (
      <article className="web-review-page">
        <ReviewHero post={post} media={media} fallbackLabel={post.product.nameAr} />

        <div className="web-review-page__body">
          <p className="web-review-page__text">{post.body}</p>
        </div>

        <ProsConsSection pros={post.pros} cons={post.cons} />

        <ProductSummaryCard product={post.product} />

        <ReviewActions postId={post.id} postTitle={post.title} />

        <CommentsSection comments={comments.data} />

        <RelatedReviews posts={relatedPosts} />
      </article>
    );
  } catch (error) {
    if (isRainaApiError(error) && error.status === 404) {
      return <NotFoundState title="المنشور غير موجود" />;
    }
    return <ApiErrorState error={error} />;
  }
}
