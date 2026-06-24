import type { Comment, Product, SearchQuery, Post } from "@raina/api-contracts";

import { apiGetData, apiGetPage } from "./client";
import { clampRating } from "@/lib/format";

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

export async function getProductRatingSummary(productId: string) {
  const posts = await listProductPosts(productId, { limit: 100 });
  const distribution = Array.from({ length: 10 }, (_, index) => {
    const rating = index + 1;
    return {
      rating,
      count: posts.data.filter((post) => clampRating(post.rating) === rating).length
    };
  });
  const total = posts.data.length;
  const sum = posts.data.reduce((value, post) => value + clampRating(post.rating), 0);

  return {
    average: total > 0 ? Number((sum / total).toFixed(2)) : 0,
    count: total,
    distribution
  };
}

export async function getSimilarProducts(productId: string) {
  const products = await listProducts({ limit: 100 });
  const product = products.data.find((item) => item.id === productId);
  if (product === undefined) return [];
  return products.data
    .filter((item) => item.id !== productId && item.categoryId === product.categoryId)
    .slice(0, 3);
}

export const getProducts = listProducts;
export const getProduct = getProductBySlug;
export const getProductPosts = listProductPosts;
export const getProductComments = listProductComments;
