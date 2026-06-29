import Image from "next/image";
import type { Category } from "@raina/api-contracts";
import { getCategoryHeroUrl } from "@/lib/config/category-images";

interface CategoryHeroProps {
  category: Category;
  productCount?: number;
  postCount?: number;
  avgRating?: number;
}

export function CategoryHero({ category, productCount, postCount, avgRating }: CategoryHeroProps) {
  const heroSrc = getCategoryHeroUrl(category.slug);

  return (
    <section className="web-cat-hero">
      <div className="web-cat-hero__bg">
        <Image
          src={heroSrc}
          alt=""
          fill
          sizes="100vw"
          className="web-cat-hero__img"
          unoptimized
        />
      </div>
      <div className="web-cat-hero__overlay" />
      <div className="web-cat-hero__body">
        <span className="web-cat-hero__eyebrow">تصنيف</span>
        <h1 className="web-cat-hero__title">{category.nameAr}</h1>
        <p className="web-cat-hero__desc">
          {category.descriptionAr ?? "منتجات وتجارب ضمن هذا التصنيف."}
        </p>
        <div className="web-cat-hero__stats">
          {productCount !== undefined ? (
            <span className="web-cat-hero__stat">
              <strong>{productCount}</strong>
              <span>منتج</span>
            </span>
          ) : null}
          {postCount !== undefined ? (
            <span className="web-cat-hero__stat">
              <strong>{postCount}</strong>
              <span>تجربة</span>
            </span>
          ) : null}
          {avgRating !== undefined ? (
            <span className="web-cat-hero__stat">
              <strong>{avgRating.toFixed(1)}</strong>
              <span>متوسط التقييم</span>
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
