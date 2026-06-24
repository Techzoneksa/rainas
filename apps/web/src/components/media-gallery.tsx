import type { ProductMedia, PostMedia } from "@raina/api-contracts";

import { RemoteImage } from "./remote-image";

type GalleryMedia = ProductMedia | PostMedia;

export function MediaGallery({
  items,
  fallbackLabel,
  className
}: Readonly<{
  items: GalleryMedia[];
  fallbackLabel: string;
  className?: string | undefined;
}>) {
  return (
    <div className={`web-gallery ${className ?? ""}`}>
      {items.length > 0 ? (
        items.map((item) => (
          <RemoteImage
            key={item.id}
            src={item.url}
            alt={item.altAr ?? `صورة ${fallbackLabel}`}
            fallbackLabel={fallbackLabel}
            className="web-gallery__item"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        ))
      ) : (
        <RemoteImage
          alt={`صورة ${fallbackLabel}`}
          fallbackLabel={fallbackLabel}
          className="web-gallery__item"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      )}
    </div>
  );
}
