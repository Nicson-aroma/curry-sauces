"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "./ui/button";

const AUTO_MS = 5000;

export default function AssetCarousel({
  imageUrls,
  altPrefix,
  aspectRatioClassName = "aspect-[16/9]",
  imageSizes = "(max-width: 768px) 100vw, 66vw",
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % imageUrls.length);
    }, AUTO_MS);

    return () => window.clearInterval(timer);
  }, [imageUrls.length]);

  const prev = () => {
    setIndex((current) => (current - 1 + imageUrls.length) % imageUrls.length);
  };

  const next = () => {
    setIndex((current) => (current + 1) % imageUrls.length);
  };

  return (
    <section aria-label="Image carousel">
      <div className="carousel-shell">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {imageUrls.map((imageUrl, imageIndex) => (
            <div key={imageUrl} className="min-w-full">
              <div className={`relative w-full ${aspectRatioClassName}`}>
                <Image
                  src={imageUrl}
                  alt={`${altPrefix ?? "Image"} ${imageIndex + 1}`}
                  fill
                  sizes={imageSizes}
                  priority={imageIndex === 0}
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center p-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="pointer-events-auto carousel-arrow"
            onClick={prev}
            aria-label="Previous image"
          >
            {"<"}
          </Button>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center p-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="pointer-events-auto carousel-arrow"
            onClick={next}
            aria-label="Next image"
          >
            {">"}
          </Button>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
          {imageUrls.map((imageUrl, currentIndex) => (
            <button
              key={imageUrl}
              type="button"
              aria-label={`Go to slide ${currentIndex + 1}`}
              onClick={() => setIndex(currentIndex)}
              className="carousel-dot"
              data-active={currentIndex === index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
