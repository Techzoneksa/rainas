import type { Route } from "next";
import Link from "next/link";
import type { Category } from "@raina/api-contracts";
import { Card } from "@raina/ui";

import { RemoteImage } from "./remote-image";

export function CategoryCard({ category }: Readonly<{ category: Category }>) {
  return (
    <Card
      className="web-content-card web-content-card--category"
      title={category.nameAr}
      description={category.descriptionAr ?? "تصنيف من منتجات رأينا"}
      variant="interactive"
      footer={
        <Link className="web-link" href={`/categories/${category.slug}` as Route}>
          عرض التصنيف
        </Link>
      }
    >
      <RemoteImage
        src={category.imageUrl}
        alt={`صورة تصنيف ${category.nameAr}`}
        fallbackLabel={category.nameAr}
        className="web-category-card__media"
      />
    </Card>
  );
}
