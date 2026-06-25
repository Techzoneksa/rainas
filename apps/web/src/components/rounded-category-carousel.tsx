import type { Route } from "next";
import Link from "next/link";
import type { Category } from "@raina/api-contracts";
import { Stack } from "@raina/ui";

import { RemoteImage } from "./remote-image";

export function RoundedCategoryCarousel({ categories }: Readonly<{ categories: Category[] }>) {
  return (
    <Stack gap="8" className="web-category-carousel-wrap">
      <ul className="web-category-carousel" aria-label="تصفح التصنيفات">
        {categories.map((category) => (
          <li key={category.id} className="web-category-carousel__item">
            <Link
              className="web-category-carousel__link"
              href={`/categories/${category.slug}` as Route}
              aria-label={`افتح تصنيف ${category.nameAr}`}
            >
              <RemoteImage
                src={category.imageUrl}
                alt={`صورة تصنيف ${category.nameAr}`}
                fallbackLabel={category.nameAr}
                className="web-category-carousel__image"
                sizes="(min-width: 768px) 104px, 88px"
              />
              <span>{category.nameAr}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Stack>
  );
}
