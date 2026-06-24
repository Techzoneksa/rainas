import type { Brand, ListQuery } from "@raina/api-contracts";

import { apiGetData, apiGetPage } from "./client";

export function listBrands(query: ListQuery = {}) {
  return apiGetPage<Brand>("/brands", {
    query: {
      page: query.page,
      limit: query.limit
    }
  });
}

export function getBrandBySlug(slug: string) {
  return apiGetData<Brand>(`/brands/${encodeURIComponent(slug)}`);
}

export const getBrands = listBrands;
export const getBrand = getBrandBySlug;
