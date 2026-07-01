import type { Route } from "next";
import Link from "next/link";
import type { SectionCard } from "@/lib/config/discovery";
import { RemoteImage } from "./remote-image";

export function DiscoveryCards({
  cards,
}: Readonly<{ cards: SectionCard[] }>) {
  return (
    <div className="web-discovery-cards-grid">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={card.href as Route}
          className="web-discovery-card-item"
        >
          <div className="web-discovery-card-item__media">
            <RemoteImage
              src={card.imageUrl}
              alt={card.nameAr}
              fallbackLabel={card.nameAr}
              className="web-discovery-card-item__image"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            />
          </div>
          <div className="web-discovery-card-item__body">
            <h3 className="web-discovery-card-item__title">{card.nameAr}</h3>
            <p className="web-discovery-card-item__desc">{card.description}</p>
            <span className="web-discovery-card-item__action">استكشف</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
