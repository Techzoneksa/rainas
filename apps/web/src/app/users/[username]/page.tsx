import type { Metadata } from "next";
import { EmptyState, Grid, Stack } from "@raina/ui";

import { PageHeader } from "@/components/page-header";
import { PostCard } from "@/components/post-card";
import { ProfileCard } from "@/components/profile-card";
import { PublicListCard } from "@/components/public-list-card";
import { ApiErrorState, NotFoundState } from "@/components/state-views";
import { isRainaApiError } from "@/lib/api/errors";
import { getPublicProfile, listPublicProfilePosts, listPublicUserLists } from "@/lib/api/users";

export const dynamic = "force-dynamic";

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
  const { username } = await params;
  try {
    const profile = await getPublicProfile(username);
    return {
      title: `${profile.displayName} | Raina — رأينا`,
      description: profile.bio ?? "ملف عام في رأينا."
    };
  } catch {
    return {
      title: "ملف عام | Raina — رأينا"
    };
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;

  try {
    const [profile, posts, lists] = await Promise.all([
      getPublicProfile(username),
      listPublicProfilePosts(username),
      listPublicUserLists(username)
    ]);

    return (
      <Stack gap="24">
        <ProfileCard profile={profile} />
        <section className="web-section" aria-labelledby="user-posts">
          <PageHeader title="منشوراته العامة" />
          {posts.data.length > 0 ? (
            <Grid className="web-card-grid web-card-grid--posts" columns="3" gap="16">
              {posts.data.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Grid>
          ) : (
            <EmptyState title="لا توجد تجارب منشورة" />
          )}
        </section>
        <section className="web-section" aria-labelledby="user-lists">
          <PageHeader title="قوائمه العامة" description="لا تظهر قوائم الحفظ الخاصة هنا." />
          {lists.data.length > 0 ? (
            <Grid className="web-card-grid web-card-grid--lists" columns="3" gap="16">
              {lists.data.map((list) => (
                <PublicListCard key={list.id} list={list} username={profile.username} />
              ))}
            </Grid>
          ) : (
            <EmptyState title="لا توجد قوائم عامة" />
          )}
        </section>
      </Stack>
    );
  } catch (error) {
    if (isRainaApiError(error) && error.status === 404) {
      return <NotFoundState title="الملف غير موجود" />;
    }
    return <ApiErrorState error={error} />;
  }
}
