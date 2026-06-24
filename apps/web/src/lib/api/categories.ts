import type { Category, ListQuery } from "@raina/api-contracts";

import { apiGetData, apiGetPage } from "./client";

export function listCategories(query: ListQuery = {}) {
  return apiGetPage<Category>("/categories", {
    query: {
      page: query.page,
      limit: query.limit
    }
  });
}

export function getCategoryBySlug(slug: string) {
  return apiGetData<Category>(`/categories/${encodeURIComponent(slug)}`);
}

export const getCategories = listCategories;
export const getCategory = getCategoryBySlug;
