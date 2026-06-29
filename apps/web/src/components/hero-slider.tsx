"use client";

import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import type { HeroSlide } from "@/lib/config/discovery";

export function HeroSlider({ slides }: Readonly<{ slides: HeroSlide[] }>) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  if (slides.length === 0) return null;

  return (
    <section className="web-hero-slider" aria-label="عروض ورائدة">
      <div className="web-hero-slider__track">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`web-hero-slider__slide ${i === current ? "web-hero-slider__slide--active" : ""}`}
            aria-hidden={i !== current}
          >
            <div className="web-hero-slider__bg">
              <Image src={s.imageUrl} alt={s.title} fill className="web-hero-slider__img" sizes="100vw" unoptimized />
            </div>
            <div className="web-hero-slider__overlay" />
            <div className="web-hero-slider__body">
              <span className="web-hero-slider__subtitle">{s.subtitle}</span>
              <h2 className="web-hero-slider__title">{s.title}</h2>
              <Link href={s.ctaHref as Route} className="web-hero-slider__cta">
                {s.ctaLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="web-hero-slider__arrow web-hero-slider__arrow--prev" onClick={prevSlide} aria-label="السابق">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </button>
      <button type="button" className="web-hero-slider__arrow web-hero-slider__arrow--next" onClick={next} aria-label="التالي">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </button>
      <div className="web-hero-slider__dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`web-hero-slider__dot ${i === current ? "web-hero-slider__dot--active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`الانتقال إلى الشريحة ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
