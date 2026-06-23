import type { Metadata } from "next";
import { EmptyState, Grid, Stack } from "@raina/ui";

import { CategoryCard } from "@/components/category-card";
import { PageHeader } from "@/components/page-header";
import { ApiErrorState } from "@/components/state-views";
import { listCategories } from "@/lib/api/categories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "التصنيفات | Raina — رأينا",
  description: "استعرض تصنيفات المنتجات في رأينا."
};

export default async function CategoriesPage() {
  try {
    const categories = await listCategories({ limit: 100 });

    return (
      <Stack gap="24">
        <PageHeader
          eyebrow="التصنيفات"
          title="كل التصنيفات"
          description="تصفح المنتجات والتجارب حسب المجال."
        />
        {categories.data.length > 0 ? (
          <Grid columns="4" gap="16">
            {categories.data.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </Grid>
        ) : (
          <EmptyState title="لا توجد تصنيفات حاليا" />
        )}
      </Stack>
    );
  } catch (error) {
    return <ApiErrorState error={error} />;
  }
}
