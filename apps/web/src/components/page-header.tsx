import { Badge, Stack } from "@raina/ui";

export interface PageHeaderProps {
  eyebrow?: string | undefined;
  titleId?: string | undefined;
  title: string;
  description?: string | undefined;
  badge?: string | undefined;
}

export function PageHeader({
  eyebrow,
  titleId,
  title,
  description,
  badge
}: Readonly<PageHeaderProps>) {
  return (
    <section className="web-page-header">
      {eyebrow ? <span className="web-eyebrow">{eyebrow}</span> : null}
      <Stack gap="8">
        {badge ? <Badge variant="primary">{badge}</Badge> : null}
        <h1 id={titleId}>{title}</h1>
        {description ? <p>{description}</p> : null}
      </Stack>
    </section>
  );
}
