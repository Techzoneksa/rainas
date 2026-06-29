"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Route } from "next";
import { Button, Checkbox, Radio, Select, Separator } from "@raina/ui";
import type { Brand } from "@raina/api-contracts";

interface CategoryFiltersProps {
  brands: Brand[];
  sortOptions: { value: string; label: string }[];
}

const ratingOptions = [
  { value: "9", label: "9+ من 10" },
  { value: "8", label: "8+ من 10" },
  { value: "7", label: "7+ من 10" },
];

const typeOptions = [
  { value: "products", label: "منتجات" },
  { value: "posts", label: "تجارب" },
];

const priceOptions = [
  { value: "0-100", label: "أقل من 100" },
  { value: "100-300", label: "100 - 300" },
  { value: "300-700", label: "300 - 700" },
  { value: "700+", label: "أكثر من 700" },
];

export function CategoryFilters({ brands, sortOptions }: CategoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentRating = searchParams.get("rating") ?? "";
  const currentType = searchParams.get("type") ?? "";
  const currentBrand = searchParams.get("brand") ?? "";
  const currentPrice = searchParams.get("price") ?? "";
  const currentSort = searchParams.get("sort") ?? "created_desc";

  const buildHref = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      return qs ? `?${qs}` : "";
    },
    [searchParams],
  );

  const filtersContent = (
    <div className="web-cat-filters__content">
      <div className="web-cat-filters__group">
        <h4 className="web-cat-filters__label">الترتيب</h4>
        <Select
          label=""
          name="sort"
          value={currentSort}
          options={sortOptions}
          onChange={(e) => {
            router.push(buildHref({ sort: e.target.value }) as Route);
          }}
        />
      </div>

      <Separator />

      <div className="web-cat-filters__group">
        <h4 className="web-cat-filters__label">التقييم</h4>
        <div className="web-cat-filters__radios">
          {ratingOptions.map((opt) => (
            <Radio
              key={opt.value}
              name="rating"
              label={opt.label}
              value={opt.value}
              checked={currentRating === opt.value}
              onChange={() => {
                const next = currentRating === opt.value ? "" : opt.value;
                router.push(buildHref({ rating: next }) as Route);
              }}
            />
          ))}
        </div>
      </div>

      <Separator />

      <div className="web-cat-filters__group">
        <h4 className="web-cat-filters__label">النوع</h4>
        <div className="web-cat-filters__radios">
          {typeOptions.map((opt) => (
            <Radio
              key={opt.value}
              name="type"
              label={opt.label}
              value={opt.value}
              checked={currentType === opt.value}
              onChange={() => {
                const next = currentType === opt.value ? "" : opt.value;
                router.push(buildHref({ type: next }) as Route);
              }}
            />
          ))}
        </div>
      </div>

      <Separator />

      <div className="web-cat-filters__group">
        <h4 className="web-cat-filters__label">العلامة التجارية</h4>
        <div className="web-cat-filters__checkboxes">
          {brands.length > 0 ? brands.slice(0, 8).map((brand) => (
            <Checkbox
              key={brand.id}
              label={brand.name}
              checked={currentBrand === brand.slug}
              onChange={() => {
                const next = currentBrand === brand.slug ? "" : brand.slug;
                router.push(buildHref({ brand: next }) as Route);
              }}
            />
          )) : (
            <span className="web-cat-filters__empty">جميع العلامات</span>
          )}
        </div>
      </div>

      <Separator />

      <div className="web-cat-filters__group">
        <h4 className="web-cat-filters__label">السعر</h4>
        <div className="web-cat-filters__radios">
          {priceOptions.map((opt) => (
            <Radio
              key={opt.value}
              name="price"
              label={opt.label}
              value={opt.value}
              checked={currentPrice === opt.value}
              onChange={() => {
                const next = currentPrice === opt.value ? "" : opt.value;
                router.push(buildHref({ price: next }) as Route);
              }}
            />
          ))}
        </div>
      </div>

      <Separator />

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          router.push(pathname as Route);
        }}
      >
        إعادة التصفية
      </Button>
    </div>
  );

  return (
    <>
      <aside className="web-cat-filters">{filtersContent}</aside>

      <button
        type="button"
        className="web-cat-filters__mobile-btn"
        onClick={() => setMobileOpen(true)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 6h16M8 12h8m-5 6h2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        فلترة
      </button>

      {mobileOpen ? (
        <div className="web-cat-filters__overlay" role="presentation">
          <div className="web-cat-filters__backdrop" onClick={() => setMobileOpen(false)} />
          <div className="web-cat-filters__drawer" role="dialog" aria-modal="true" aria-label="فلترة">
            <div className="web-cat-filters__drawer-head">
              <strong>فلترة</strong>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="إغلاق">
                ×
              </button>
            </div>
            <div className="web-cat-filters__drawer-body">{filtersContent}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}
