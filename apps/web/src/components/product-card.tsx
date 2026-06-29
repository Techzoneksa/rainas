import type { Route } from "next";
import Link from "next/link";
import type { Product } from "@raina/api-contracts";
import { Badge, Inline } from "@raina/ui";

import { formatPrice } from "@/lib/format";

import { RatingBadge } from "./rating-badge";
import { RemoteImage } from "./remote-image";

export function ProductCard({ product }: Readonly<{ product: Product }>) {
  const media = product.media?.[0];

  return (
    <article className="web-cat-card">
      <div className="web-cat-card__media">
        <RemoteImage
          src={media?.url}
          alt={product.nameAr}
          fallbackLabel={product.nameAr}
          className="web-cat-card__image"
        />
      </div>
      <div className="web-cat-card__body">
        <Inline gap="6" justify="start">
          <Badge variant="info">{product.category.nameAr}</Badge>
          {product.brand ? <Badge>{product.brand.name}</Badge> : null}
        </Inline>
        <h3 className="web-cat-card__title">{product.nameAr}</h3>
        {product.summaryAr ? (
          <p className="web-cat-card__summary">{product.summaryAr}</p>
        ) : null}
        <Inline gap="8" justify="between">
          <span className="web-cat-card__price">
            {formatPrice(product.priceMin, product.priceMax, product.currency)}
          </span>
          <RatingBadge value={product.ratingAverage} />
        </Inline>
        <Link
          className="web-cat-card__cta"
          href={`/products/${product.slug}` as Route}
        >
          تفاصيل المنتج
        </Link>
      </div>
    </article>
  );
}
