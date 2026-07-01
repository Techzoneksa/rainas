export interface MediaPlaceholderProps {
  label: string;
  className?: string | undefined;
  fallbackSrc?: string | undefined;
}

function MediaIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MediaPlaceholder({
  label,
  className,
  fallbackSrc,
}: Readonly<MediaPlaceholderProps>) {
  if (fallbackSrc) {
    return (
      <div className={`web-image-frame ${className ?? ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fallbackSrc} alt={label} className="web-image-frame__image" />
      </div>
    );
  }
  return (
    <div className={`web-media ${className ?? ""}`} role="img" aria-label={label}>
      <MediaIcon />
      <strong>{label}</strong>
    </div>
  );
}
