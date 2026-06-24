import type { PublicProfile } from "@raina/api-contracts";

import { ProfileSummary } from "./profile-summary";

export function ProfileCard({ profile }: Readonly<{ profile: PublicProfile }>) {
  return <ProfileSummary profile={profile} />;
}
