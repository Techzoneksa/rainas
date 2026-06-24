"use client";

import Image from "next/image";
import { useState } from "react";

import { MediaPlaceholder } from "./media-placeholder";

interface RemoteImageProps {
  src?: string | null | undefined;
  alt: string;
  fallbackLabel: string;
  className?: string | undefined;
  sizes?: string | undefined;
}

export function RemoteImage({
  src,
  alt,
  fallbackLabel,
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
}: Readonly<RemoteImageProps>) {
  const [hasError, setHasError] = useState(false);

  if (src === undefined || src === null || src.length === 0 || hasError) {
    return <MediaPlaceholder label={fallbackLabel} type="IMAGE" className={className} />;
  }

  return (
    <div className={`web-image-frame ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="web-image-frame__image"
        unoptimized
        onError={() => setHasError(true)}
      />
    </div>
  );
}
