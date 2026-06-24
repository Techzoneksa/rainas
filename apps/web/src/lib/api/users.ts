import type { Post, PublicList, PublicProfile } from "@raina/api-contracts";

import { listPosts } from "./posts";
import { apiGetData, apiGetPage } from "./client";

export function getPublicProfile(username: string) {
  return apiGetData<PublicProfile>(`/profiles/${encodeURIComponent(username)}`);
}

export async function listPublicProfilePosts(username: string) {
  const posts = await listPosts({ limit: 100 });
  return {
    data: posts.data.filter((post) => post.author.profile?.username === username),
    meta: posts.meta
  } satisfies { data: Post[]; meta: typeof posts.meta };
}

export function listPublicUserLists(username: string) {
  return apiGetPage<PublicList>(`/users/${encodeURIComponent(username)}/lists`, {
    query: {
      limit: 100
    }
  });
}

export const getPublicUser = getPublicProfile;
export const getPublicUserPosts = listPublicProfilePosts;
export const getPublicUserLists = listPublicUserLists;
