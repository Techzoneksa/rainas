import type { Post } from "@raina/api-contracts";
import { Badge, Card, Progress, Stack } from "@raina/ui";

import { clampRating, formatRating } from "@/lib/format";

export interface RatingSummaryProps {
  average: number | string | null | undefined;
  count: number;
  posts?: Post[];
}

export function RatingSummary({ average, count, posts = [] }: Readonly<RatingSummaryProps>) {
  const distribution = Array.from({ length: 10 }, (_, index) => {
    const rating = 10 - index;
    return {
      rating,
      count: posts.filter((post) => clampRating(post.rating) === rating).length
    };
  });
  const maxCount = Math.max(1, ...distribution.map((item) => item.count));

  return (
    <Card title="ملخص التقييم" description="التقييمات من 1 إلى 10">
      <Stack gap="16">
        <div className="web-rating-summary">
          <strong>{formatRating(average)}</strong>
          <Badge variant="purple">{count} تجربة</Badge>
        </div>
        <Stack gap="8">
          {distribution.map((item) => (
            <Progress
              key={item.rating}
              label={`${item.rating} من 10 · ${item.count}`}
              value={item.count}
              max={maxCount}
            />
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
