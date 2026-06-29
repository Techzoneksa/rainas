"use client";

import { useCallback } from "react";

interface ReviewActionsProps {
  postId: string;
  postTitle: string;
}

export function ReviewActions({ postId, postTitle }: ReviewActionsProps) {
  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(url).catch(() => {});
  }, [postId]);

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/posts/${postId}`;
    if (navigator.share) {
      navigator.share({ title: postTitle, url }).catch(() => {});
    } else {
      handleCopyLink();
    }
  }, [postId, postTitle, handleCopyLink]);

  return (
    <div className="web-review-actions">
      <button type="button" className="web-review-actions__btn" title="حفظ">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>حفظ</span>
      </button>
      <button type="button" className="web-review-actions__btn" title="مشاركة" onClick={handleShare}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="18" cy="5" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="6" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="18" cy="19" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <span>مشاركة</span>
      </button>
      <button type="button" className="web-review-actions__btn" title="نسخ الرابط" onClick={handleCopyLink}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>نسخ الرابط</span>
      </button>
    </div>
  );
}
