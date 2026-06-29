"use client";

import Image from "next/image";
import { useState } from "react";

import { DEFAULT_IMAGE_URL } from "@/lib/config/category-images";
import { MediaPlaceholder } from "./media-placeholder";

interface RemoteImageProps {
  src?: string | null | undefined;
  alt: string;
  fallbackLabel: string;
  fallbackSrc?: string | undefined;
  className?: string | undefined;
  sizes?: string | undefined;
}

export function RemoteImage({
  src,
  alt,
  fallbackLabel,
  fallbackSrc,
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
}: Readonly<RemoteImageProps>) {
  const resolvedSrc = src || fallbackSrc || DEFAULT_IMAGE_URL;
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <MediaPlaceholder label={fallbackLabel} className={className} />;
  }

  return (
    <div className={`web-image-frame ${className ?? ""}`}>
      <Image
        src={resolvedSrc}
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
