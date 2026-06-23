import type { Metadata } from "next";
import { EmptyState, Grid, Stack } from "@raina/ui";

import { PageHeader } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { ApiErrorState, NotFoundState } from "@/components/state-views";
import { getCategoryBySlug } from "@/lib/api/categories";
import { isRainaApiError } from "@/lib/api/errors";
import { listProducts } from "@/lib/api/products";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    return {
      title: `${category.nameAr} | Raina — رأينا`,
      description: category.descriptionAr ?? "تصنيف منتجات في رأينا."
    };
  } catch {
    return {
      title: "تصنيف | Raina — رأينا"
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  try {
    const category = await getCategoryBySlug(slug);
    const products = await listProducts({ categoryId: category.id, limit: 24 });

    return (
      <Stack gap="24">
        <PageHeader
          eyebrow="تصنيف"
          title={category.nameAr}
          description={category.descriptionAr ?? "منتجات وتجارب ضمن هذا التصنيف."}
        />
        {products.data.length > 0 ? (
          <Grid columns="3" gap="16">
            {products.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        ) : (
          <EmptyState title="لا توجد منتجات حاليا" />
        )}
      </Stack>
    );
  } catch (error) {
    if (isRainaApiError(error) && error.status === 404) {
      return <NotFoundState title="التصنيف غير موجود" />;
    }
    return <ApiErrorState error={error} />;
  }
}
