"use client";

import Image from "next/image";
import { useState } from "react";

import { DEFAULT_IMAGE_URL } from "@/lib/config/category-images";
import { safeCategoryImage } from "@/lib/category-visuals";
import { MediaPlaceholder } from "./media-placeholder";

interface RemoteImageProps {
  src?: string | null | undefined;
  alt: string;
  fallbackLabel: string;
  fallbackSrc?: string | undefined;
  className?: string | undefined;
  sizes?: string | undefined;
  categorySlug?: string | undefined;
  categoryFallbackIndex?: number | undefined;
}

export function RemoteImage({
  src,
  alt,
  fallbackLabel,
  fallbackSrc,
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  categorySlug,
  categoryFallbackIndex = 0,
}: Readonly<RemoteImageProps>) {
  const resolvedSrc = src || fallbackSrc || (categorySlug ? safeCategoryImage(categorySlug, null, categoryFallbackIndex) : null) || DEFAULT_IMAGE_URL;
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    const fallbackSrcOnError = categorySlug
      ? safeCategoryImage(categorySlug, null, categoryFallbackIndex)
      : DEFAULT_IMAGE_URL;
    return <MediaPlaceholder label={fallbackLabel} className={className} fallbackSrc={fallbackSrcOnError} />;
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