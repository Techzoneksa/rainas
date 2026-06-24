import type { Metadata } from "next";
import { EmptyState, Grid, Stack } from "@raina/ui";

import { FilterBar } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { PaginationControls } from "@/components/pagination-controls";
import { PostCard } from "@/components/post-card";
import { ApiErrorState } from "@/components/state-views";
import { listBrands } from "@/lib/api/brands";
import { listCategories } from "@/lib/api/categories";
import { listPosts } from "@/lib/api/posts";
import type { PageSearchParams } from "@/lib/search-params";
import { readPage, readParam, readSort } from "@/lib/search-params";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "المنشورات | Raina — رأينا",
  description: "اقرأ تجارب المستخدمين المنشورة في رأينا."
};

export default async function PostsPage({
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
    const posts = await listPosts({
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
          eyebrow="المنشورات"
          title="تجارب المستخدمين"
          description="استعرض التجارب المنشورة مع تقييم واضح من 10."
        />
        <FilterBar
          search={search}
          category={categorySlug}
          brand={brandSlug}
          sort={sort}
          categories={categories.data}
          brands={brands.data}
        />
        {posts.data.length > 0 ? (
          <Grid columns="3" gap="16">
            {posts.data.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Grid>
        ) : (
          <EmptyState title="لا توجد تجارب بعد" description="جرب تغيير الفلاتر أو البحث." />
        )}
        <PaginationControls
          meta={posts.meta}
          path="/posts"
          params={{ search, category: categorySlug, brand: brandSlug, sort }}
        />
      </Stack>
    );
  } catch (error) {
    return <ApiErrorState error={error} />;
  }
}
