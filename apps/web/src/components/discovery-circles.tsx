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
        <div className="web-section-head">
          <h2 className="web-section-head__title">{title}</h2>
          {description ? <p className="web-section-head__desc">{description}</p> : null}
        </div>
      ) : null}
      <div className="web-discovery-track-wrap">
        <ul className="web-discovery-track" aria-label="اكتشف">
          {items.map((item) => (
            <li key={item.id} className="web-discovery-track__item">
              <Link href={item.href as Route} className="web-discovery-track__link" aria-label={item.nameAr}>
                <div className="web-discovery-track__image">
                  <Image src={item.imageUrl} alt={item.nameAr} fill sizes="88px" className="web-discovery-track__img" />
                </div>
                <span className="web-discovery-track__label">{item.nameAr}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
