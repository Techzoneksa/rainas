import type { Comment, Post, SearchQuery } from "@raina/api-contracts";

import { apiGetData, apiGetPage } from "./client";

export function listPosts(query: SearchQuery = {}) {
  return apiGetPage<Post>("/posts", {
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

export function getPostById(id: string) {
  return apiGetData<Post>(`/posts/${encodeURIComponent(id)}`);
}

export function listPostComments(postId: string, query: SearchQuery = {}) {
  return apiGetPage<Comment>(`/posts/${encodeURIComponent(postId)}/comments`, {
    query: {
      page: query.page,
      limit: query.limit
    }
  });
}
