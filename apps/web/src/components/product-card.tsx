import type { Route } from "next";
import Link from "next/link";
import type { Product } from "@raina/api-contracts";
import { Badge, Card, Inline, Stack } from "@raina/ui";

import { formatCount, formatPrice, formatRating } from "@/lib/format";

import { MediaPlaceholder } from "./media-placeholder";

export function ProductCard({ product }: Readonly<{ product: Product }>) {
  const media = product.media?.[0];

  return (
    <Card
      title={product.nameAr}
      description={product.summaryAr ?? product.descriptionAr ?? "منتج ضمن قاعدة رأينا"}
      variant="interactive"
      footer={
        <Link className="web-link" href={`/products/${product.slug}` as Route}>
          تفاصيل المنتج
        </Link>
      }
    >
      <Stack gap="12">
        <MediaPlaceholder
          label={media?.altAr ?? product.nameAr}
          type={media?.type}
          className="web-product-card__media"
        />
        <Inline gap="8">
          <Badge>{product.brand.name}</Badge>
          <Badge variant="info">{product.category.nameAr}</Badge>
        </Inline>
        <dl className="web-meta-list">
          <div>
            <dt>السعر التقريبي</dt>
            <dd>{formatPrice(product.priceMin, product.priceMax, product.currency)}</dd>
          </div>
          <div>
            <dt>التقييم</dt>
            <dd>{formatRating(product.ratingAverage)}</dd>
          </div>
          <div>
            <dt>التجارب</dt>
            <dd>{formatCount(product.ratingCount, "تجربة")}</dd>
          </div>
        </dl>
      </Stack>
    </Card>
  );
}
