"use client";

import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCallback, useEffect, useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export default function ProjectGallery({ images, title }: Props) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const count = images.length;

  const go = useCallback(
    (step: number) => setIndex((i) => (i + step + count) % count),
    [count],
  );

  // Lightbox: Esc closes, arrows navigate, page scroll is locked.
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  if (count === 0) return null;

  function onStageKey(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  }

  return (
    <div className="gallery">
      <div
        className="gallery-stage"
        tabIndex={0}
        onKeyDown={onStageKey}
        aria-label={`${title} screenshots`}
      >
        <button
          type="button"
          className="gallery-main"
          onClick={() => setOpen(true)}
          aria-label="View image full screen"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[index]} alt={`${title} screenshot ${index + 1}`} />
        </button>

        <span className="gallery-expand" aria-hidden="true">
          <Maximize2 size={16} />
        </span>

        {count > 1 && (
          <>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-prev"
              onClick={() => go(-1)}
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-next"
              onClick={() => go(1)}
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>
            <span className="gallery-count">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className="gallery-thumb"
              aria-current={i === index}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} images`}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[index]}
            alt={`${title} screenshot ${index + 1}`}
            onClick={(event) => event.stopPropagation()}
          />

          {count > 1 && (
            <>
              <button
                type="button"
                className="gallery-arrow gallery-arrow-prev"
                onClick={(event) => {
                  event.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                className="gallery-arrow gallery-arrow-next"
                onClick={(event) => {
                  event.stopPropagation();
                  go(1);
                }}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
              <span className="gallery-count">
                {index + 1} / {count}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}