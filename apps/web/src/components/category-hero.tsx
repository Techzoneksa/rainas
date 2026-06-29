import Image from "next/image";
import type { Category } from "@raina/api-contracts";
<<<<<<< HEAD
import { getCategoryHeroUrl } from "@/lib/config/category-images";
=======
import { getCategoryHeroUrl, getCategoryAccentColor, getCategoryDescriptionAr, getVisualByUrlSlug } from "@/lib/config/category-images";
>>>>>>> f79a2f1 (fix: correctly bind category visuals and filtered content)

interface CategoryHeroProps {
  category: Category;
  urlSlug: string;
  productCount?: number;
  postCount?: number;
  avgRating?: number;
}

<<<<<<< HEAD
export function CategoryHero({ category, productCount, postCount, avgRating }: CategoryHeroProps) {
  const heroSrc = getCategoryHeroUrl(category.slug);
=======
export function CategoryHero({ category, urlSlug, productCount, postCount, avgRating }: CategoryHeroProps) {
  const heroSrc = getCategoryHeroUrl(urlSlug);
  const accentColor = getCategoryAccentColor(urlSlug);
  const visualDesc = getCategoryDescriptionAr(urlSlug);
  const visualNameAr = getVisualByUrlSlug(urlSlug)?.nameAr ?? category.nameAr;
>>>>>>> f79a2f1 (fix: correctly bind category visuals and filtered content)

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
        <h1 className="web-cat-hero__title">{visualNameAr}</h1>
        <p className="web-cat-hero__desc">
<<<<<<< HEAD
          {category.descriptionAr ?? "منتجات وتجارب ضمن هذا التصنيف."}
=======
          {(visualDesc || category.descriptionAr) ?? "منتجات وتجارب ضمن هذا التصنيف."}
>>>>>>> f79a2f1 (fix: correctly bind category visuals and filtered content)
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
