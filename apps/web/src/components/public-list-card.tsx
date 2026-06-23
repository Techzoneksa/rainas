import type { Route } from "next";
import Link from "next/link";
import type { PublicList } from "@raina/api-contracts";
import { Badge, Card, Inline } from "@raina/ui";

export function PublicListCard({
  list,
  username
}: Readonly<{ list: PublicList; username: string }>) {
  return (
    <Card
      title={list.title}
      description={list.description ?? "قائمة عامة من الناشر"}
      variant="interactive"
      footer={
        <Link className="web-link" href={`/users/${username}/lists/${list.slug}` as Route}>
          عرض القائمة
        </Link>
      }
    >
      <Inline gap="8">
        <Badge variant="primary">عامة</Badge>
        <Badge>{list.items.length} عنصر</Badge>
      </Inline>
    </Card>
  );
}
