import type { Route } from "next";
import Link from "next/link";
import type { Category } from "@raina/api-contracts";
import { Card } from "@raina/ui";

export function CategoryCard({ category }: Readonly<{ category: Category }>) {
  return (
    <Card
      title={category.nameAr}
      description={category.descriptionAr ?? "تصنيف من منتجات رأينا"}
      variant="interactive"
      footer={
        <Link className="web-link" href={`/categories/${category.slug}` as Route}>
          عرض التصنيف
        </Link>
      }
    />
  );
}
