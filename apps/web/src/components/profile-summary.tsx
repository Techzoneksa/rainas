import type { PublicProfile } from "@raina/api-contracts";
import { Avatar, Badge, Card, Inline, Stack } from "@raina/ui";

export function ProfileSummary({ profile }: Readonly<{ profile: PublicProfile }>) {
  return (
    <Card title={profile.displayName} description={profile.bio ?? "ملف عام في رأينا"}>
      <Stack gap="12">
        <Inline gap="12" align="center">
          <Avatar name={profile.displayName} imageUrl={profile.avatarUrl ?? undefined} size="lg" />
          <Stack gap="4">
            <strong dir="ltr">@{profile.username}</strong>
            {profile.city ? <span className="web-muted">{profile.city}</span> : null}
          </Stack>
        </Inline>
        <Inline gap="8">
          <Badge variant="primary">ملف عام</Badge>
          <Badge>قوائم الناشر العامة فقط</Badge>
        </Inline>
      </Stack>
    </Card>
  );
}
