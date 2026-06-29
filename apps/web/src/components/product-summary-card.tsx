import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@raina/api-contracts";
import { Badge, Inline } from "@raina/ui";

import { formatPrice, formatRating } from "@/lib/format";
import { getCategoryImageUrl } from "@/lib/config/category-images";

interface ProductSummaryCardProps {
  product: Product;
}

export function ProductSummaryCard({ product }: ProductSummaryCardProps) {
  const media = product.media?.[0];

  return (
    <div className="web-prod-summary">
      <div className="web-prod-summary__media">
        <Image
          src={media?.url ?? getCategoryImageUrl(product.category.slug, null)}
          alt={product.nameAr}
          fill
          sizes="180px"
          className="web-prod-summary__img"
          unoptimized
        />
      </div>
      <div className="web-prod-summary__body">
        <h3 className="web-prod-summary__name">{product.nameAr}</h3>
        <Inline gap="6">
          {product.brand ? <Badge>{product.brand.name}</Badge> : null}
          <Badge variant="info">{product.category.nameAr}</Badge>
        </Inline>
        <div className="web-prod-summary__rating">
          <strong className="web-prod-summary__rating-value">{formatRating(product.ratingAverage)}</strong>
        </div>
        <span className="web-prod-summary__price">
          {formatPrice(product.priceMin, product.priceMax, product.currency)}
        </span>
        <Link className="web-prod-summary__cta" href={`/products/${product.slug}` as Route}>
          استكشف المنتج
        </Link>
      </div>
    </div>
  );
}
