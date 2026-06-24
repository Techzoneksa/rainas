import { Badge } from "@raina/ui";

import { formatRating } from "@/lib/format";

export function RatingBadge({
  value,
  label = "التقييم"
}: Readonly<{ value: number | string | null | undefined; label?: string }>) {
  return <Badge variant="primary">{`${label}: ${formatRating(value)}`}</Badge>;
}
