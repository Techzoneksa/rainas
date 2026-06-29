import type { Comment } from "@raina/api-contracts";
import { Avatar } from "@raina/ui";

import { formatDate } from "@/lib/format";

interface CommentsSectionProps {
  comments: Comment[];
}

export function CommentsSection({ comments }: CommentsSectionProps) {
  if (comments.length === 0) {
    return (
      <section className="web-comments" aria-labelledby="comments-heading">
        <h2 id="comments-heading">التعليقات</h2>
        <p className="web-comments__empty">لا توجد تعليقات بعد. كن أول من يعلق!</p>
      </section>
    );
  }

  return (
    <section className="web-comments" aria-labelledby="comments-heading">
      <h2 id="comments-heading">التعليقات</h2>
      <div className="web-comments__list">
        {comments.map((comment) => {
          const profile = comment.author.profile;
          return (
            <div key={comment.id} className="web-comments__item">
              <Avatar
                name={profile?.displayName ?? "مستخدم رأينا"}
                imageUrl={profile?.avatarUrl ?? undefined}
              />
              <div className="web-comments__body">
                <div className="web-comments__meta">
                  <strong>{profile?.displayName ?? "مستخدم رأينا"}</strong>
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
                <p className="web-comments__text">{comment.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
