import type { ReactNode } from "react";

interface SectionCarouselProps {
  children: ReactNode;
  ariaLabel: string;
}

export function SectionCarousel({ children, ariaLabel }: SectionCarouselProps) {
  return (
    <div className="web-section-carousel-wrap">
      <div className="web-section-carousel" aria-label={ariaLabel} role="list" tabIndex={0}>
        {children}
      </div>
    </div>
  );
}

export function SectionCarouselItem({ children }: { children: ReactNode }) {
  return (
    <div className="web-section-carousel__item" role="listitem">
      {children}
    </div>
  );
}
