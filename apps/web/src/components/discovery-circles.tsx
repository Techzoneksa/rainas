import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import type { DiscoveryCircle } from "@/lib/config/discovery";

export function DiscoveryCircles({
  items,
  title,
  description
}: Readonly<{
  items: DiscoveryCircle[];
  title?: string;
  description?: string;
}>) {
  if (items.length === 0) return null;

  return (
    <section className="web-discovery-section" aria-labelledby={title ? "home-discovery" : undefined}>
      {title ? (
        <div className="web-discovery-header">
          <div>
            <h2>{title}</h2>
            {description ? <p className="web-discovery-header__desc">{description}</p> : null}
          </div>
        </div>
      ) : null}
      <div className="web-discovery-circles" aria-label="اكتشف">
        {items.map((item) => (
          <Link key={item.id} href={item.href as Route} className="web-discovery-circle" aria-label={item.nameAr}>
            <div className="web-discovery-circle__img">
              <Image src={item.imageUrl} alt={item.nameAr} fill sizes="88px" className="web-discovery-circle__image" />
            </div>
            <span className="web-discovery-circle__label">{item.nameAr}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
