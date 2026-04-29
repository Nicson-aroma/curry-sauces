"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "../lib/utils";

export default function ProductImage({
  src,
  srcCandidates = [],
  alt,
  className,
}) {
  const candidates = [src, ...srcCandidates];
  const [index, setIndex] = useState(0);
  const imageSource = candidates[index] ?? "/file.svg";

  return (
    <span className="relative block h-full w-full">
      <Image
        src={imageSource}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={cn("object-cover", className)}
        onError={() => {
          setIndex((current) => Math.min(current + 1, candidates.length - 1));
        }}
      />
    </span>
  );
}
