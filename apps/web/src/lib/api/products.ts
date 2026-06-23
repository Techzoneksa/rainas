import type { Comment, Product, SearchQuery, Post } from "@raina/api-contracts";

import { apiGetData, apiGetPage } from "./client";

export function listProducts(query: SearchQuery = {}) {
  return apiGetPage<Product>("/products", {
    query: {
      page: query.page,
      limit: query.limit,
      q: query.q,
      categoryId: query.categoryId,
      brandId: query.brandId,
      sort: query.sort
    }
  });
}

export function getProductBySlug(slug: string) {
  return apiGetData<Product>(`/products/${encodeURIComponent(slug)}`);
}

export function listProductPosts(productId: string, query: SearchQuery = {}) {
  return apiGetPage<Post>(`/products/${encodeURIComponent(productId)}/posts`, {
    query: {
      page: query.page,
      limit: query.limit
    }
  });
}

export function listProductComments(productId: string, query: SearchQuery = {}) {
  return apiGetPage<Comment>(`/products/${encodeURIComponent(productId)}/comments`, {
    query: {
      page: query.page,
      limit: query.limit
    }
  });
}
