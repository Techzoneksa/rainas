import type { MediaType } from "@raina/api-contracts";

export interface MediaPlaceholderProps {
  label: string;
  type?: MediaType | undefined;
  className?: string | undefined;
}

export function MediaPlaceholder({
  label,
  type = "IMAGE",
  className
}: Readonly<MediaPlaceholderProps>) {
  return (
    <div className={`web-media ${className ?? ""}`} role="img" aria-label={label}>
      <span>{type === "VIDEO" ? "فيديو" : "صورة"}</span>
      <strong>{label}</strong>
    </div>
  );
}
