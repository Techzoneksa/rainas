import type { Post } from "@raina/api-contracts";
import { PostCard } from "./post-card";

interface RelatedReviewsProps {
  posts: Post[];
}

export function RelatedReviews({ posts }: RelatedReviewsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="web-related" aria-labelledby="related-heading">
      <h2 id="related-heading">تجارب مشابهة</h2>
      <div className="web-related__row">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
