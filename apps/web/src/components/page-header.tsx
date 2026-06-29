import type { ReactNode } from "react";
import { Badge, Stack } from "@raina/ui";

export interface PageHeaderProps {
  eyebrow?: string | undefined;
  titleId?: string | undefined;
  title: string;
  description?: string | undefined;
  badge?: string | undefined;
  action?: ReactNode | undefined;
}

export function PageHeader({
  eyebrow,
  titleId,
  title,
  description,
  badge,
  action
}: Readonly<PageHeaderProps>) {
  return (
    <section className="web-page-header">
      {eyebrow ? <span className="web-eyebrow">{eyebrow}</span> : null}
      <Stack gap="8">
        <div className="web-page-header__row">
          <div style={{ display: "grid", gap: "var(--raina-space-8)" }}>
            {badge ? <Badge variant="primary">{badge}</Badge> : null}
            <h1 id={titleId}>{title}</h1>
          </div>
          {action ? <div className="web-page-header__action">{action}</div> : null}
        </div>
        {description ? <p>{description}</p> : null}
      </Stack>
    </section>
  );
}
