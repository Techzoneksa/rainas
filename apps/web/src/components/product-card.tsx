import type { Route } from "next";
import Link from "next/link";
import type { Product } from "@raina/api-contracts";
import { Badge } from "@raina/ui";

import { formatPrice, formatRating } from "@/lib/format";

import { RemoteImage } from "./remote-image";

export function ProductCard({ product }: Readonly<{ product: Product }>) {
  const media = product.media?.[0];

  return (
    <article className="web-prod-card">
      <Link href={`/products/${product.slug}` as Route} className="web-prod-card__link">
        <div className="web-prod-card__media">
          <RemoteImage
            src={media?.url}
            alt={media?.altAr ?? product.nameAr}
            fallbackLabel={product.nameAr}
            className="web-prod-card__image"
            categorySlug={product.category?.slug}
            categoryFallbackIndex={0}
          />
        </div>
        <div className="web-prod-card__body">
          <div className="web-prod-card__badges">
            {product.category ? (
              <Badge>{product.category.nameAr}</Badge>
            ) : null}
            {product.brand ? (
              <Badge variant="neutral">{product.brand.name}</Badge>
            ) : null}
          </div>
          <h3 className="web-prod-card__title">{product.nameAr}</h3>
          <p className="web-prod-card__summary">{product.summaryAr}</p>
          <div className="web-prod-card__footer">
            <span className="web-prod-card__price">
              {formatPrice(product.priceMin, product.priceMax, product.currency)}
            </span>
            <span className="web-prod-card__rating">
              {formatRating(product.ratingAverage)}
            </span>
          </div>
          <span className="web-prod-card__action">استكشف المنتج</span>
        </div>
      </Link>
    </article>
  );
}
