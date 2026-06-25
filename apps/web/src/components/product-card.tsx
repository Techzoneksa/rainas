import type { Route } from "next";
import Link from "next/link";
import type { Product } from "@raina/api-contracts";
import { Badge, Card, Inline, Stack } from "@raina/ui";

import { formatCount, formatPrice } from "@/lib/format";

import { RatingBadge } from "./rating-badge";
import { RemoteImage } from "./remote-image";

export function ProductCard({ product }: Readonly<{ product: Product }>) {
  const media = product.media?.[0];

  return (
    <Card
      className="web-content-card web-content-card--product"
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
        <RemoteImage
          src={media?.url}
          alt={media?.altAr ?? `صورة ${product.nameAr}`}
          fallbackLabel={product.nameAr}
          className="web-product-card__media"
        />
        <Inline gap="8" justify="start">
          <Badge variant="info">{product.category.nameAr}</Badge>
        </Inline>
        <div className="web-product-card__details">
          <div className="web-product-card__price">
            <span className="web-muted">
              {formatPrice(product.priceMin, product.priceMax, product.currency)}
            </span>
          </div>
          <div className="web-product-card__rating">
            <RatingBadge value={product.ratingAverage} />
            <span className="web-muted">({formatCount(product.ratingCount, "")})</span>
          </div>
        </div>
      </Stack>
    </Card>
  );
}
