import type { Metadata } from "next";
import { EmptyState, Grid, Stack } from "@raina/ui";

import { FilterBar } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { PaginationControls } from "@/components/pagination-controls";
import { ProductCard } from "@/components/product-card";
import { ApiErrorState } from "@/components/state-views";
import { listBrands } from "@/lib/api/brands";
import { listCategories } from "@/lib/api/categories";
import { listProducts } from "@/lib/api/products";
import type { PageSearchParams } from "@/lib/search-params";
import { readPage, readParam, readSort } from "@/lib/search-params";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "المنتجات | Raina — رأينا",
  description: "استكشف منتجات رأينا حسب التصنيف والعلامة والتقييم."
};

export default async function ProductsPage({
  searchParams
}: Readonly<{ searchParams: PageSearchParams }>) {
  const params = await searchParams;
  const search = readParam(params, "search");
  const categorySlug = readParam(params, "category");
  const brandSlug = readParam(params, "brand");
  const sort = readSort(params);
  const page = readPage(params);

  try {
    const [categories, brands] = await Promise.all([
      listCategories({ limit: 100 }),
      listBrands({ limit: 100 })
    ]);
    const category = categories.data.find((item) => item.slug === categorySlug);
    const brand = brands.data.find((item) => item.slug === brandSlug);
    const products = await listProducts({
      page,
      limit: 24,
      q: search,
      categoryId: category?.id,
      brandId: brand?.id,
      sort
    });

    return (
      <Stack gap="24">
        <PageHeader
          eyebrow="المنتجات"
          title="استكشف المنتجات"
          description="فلتر المنتجات قراءة فقط حسب البحث والتصنيف والعلامة."
        />
        <FilterBar
          search={search}
          category={categorySlug}
          brand={brandSlug}
          sort={sort}
          categories={categories.data}
          brands={brands.data}
        />
        {products.data.length > 0 ? (
          <Grid columns="3" gap="16">
            {products.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        ) : (
          <EmptyState title="لا توجد منتجات حاليا" description="جرب تغيير الفلاتر أو البحث." />
        )}
        <PaginationControls
          meta={products.meta}
          path="/products"
          params={{ search, category: categorySlug, brand: brandSlug, sort }}
        />
      </Stack>
    );
  } catch (error) {
    return <ApiErrorState error={error} />;
  }
}
