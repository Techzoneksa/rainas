import type { Brand, Category } from "@raina/api-contracts";
import { Button, Input, Select } from "@raina/ui";

export interface FilterBarProps {
  search?: string | undefined;
  category?: string | undefined;
  brand?: string | undefined;
  sort?: string | undefined;
  categories?: Category[];
  brands?: Brand[];
}

export function FilterBar({
  search,
  category,
  brand,
  sort,
  categories = [],
  brands = []
}: Readonly<FilterBarProps>) {
  return (
    <form className="web-filter-bar" method="get">
      <Input
        label="بحث"
        name="search"
        kind="search"
        defaultValue={search}
        placeholder="ابحث باسم المنتج أو التجربة"
      />
      <Select
        label="التصنيف"
        name="category"
        defaultValue={category ?? ""}
        options={[
          { value: "", label: "كل التصنيفات" },
          ...categories.map((item) => ({ value: item.slug, label: item.nameAr }))
        ]}
      />
      <Select
        label="العلامة"
        name="brand"
        defaultValue={brand ?? ""}
        options={[
          { value: "", label: "كل العلامات" },
          ...brands.map((item) => ({ value: item.slug, label: item.name }))
        ]}
      />
      <Select
        label="الترتيب"
        name="sort"
        defaultValue={sort ?? "created_desc"}
        options={[
          { value: "created_desc", label: "الأحدث" },
          { value: "created_asc", label: "الأقدم" },
          { value: "rating_desc", label: "الأعلى تقييما" },
          { value: "rating_asc", label: "الأقل تقييما" }
        ]}
      />
      <Button type="submit">تطبيق</Button>
    </form>
  );
}
