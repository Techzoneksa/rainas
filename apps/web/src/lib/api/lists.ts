import type { Product, PublicList, PublicListDetails } from "@raina/api-contracts";

import { apiGetData } from "./client";
import { listProducts } from "./products";
import { getPostById } from "./posts";
import { listPublicUserLists } from "./users";

export async function getPublicListBySlug(
  username: string,
  slug: string
): Promise<PublicListDetails> {
  const lists = await listPublicUserLists(username);
  const list = lists.data.find(
    (item) =>
      item.slug === slug && item.purpose === "PUBLISHER_PUBLIC" && item.visibility === "PUBLIC"
  );

  if (list === undefined) {
    return apiGetData<PublicList>(
      `/users/${encodeURIComponent(username)}/lists/${encodeURIComponent(slug)}`
    ).then((fallbackList) => ({
      list: fallbackList,
      posts: [],
      products: []
    }));
  }

  const postIds = list.items
    .filter((item) => item.targetType === "POST")
    .map((item) => item.targetId);
  const productIds = new Set(
    list.items.filter((item) => item.targetType === "PRODUCT").map((item) => item.targetId)
  );

  const [posts, productsPage] = await Promise.all([
    Promise.all(postIds.map((postId) => getPostById(postId))),
    productIds.size > 0
      ? listProducts({ limit: 100 })
      : Promise.resolve({ data: [], meta: lists.meta })
  ]);
  const products = productsPage.data.filter((product: Product) => productIds.has(product.id));

  return {
    list,
    posts,
    products
  };
}

export const getPublicUserList = getPublicListBySlug;
