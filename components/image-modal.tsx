"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageData {
  id: string;
  cloudinaryUrl: string;
}

export function ImageModal({
  image,
  onClose,
}: {
  image: ImageData;
  onClose: () => void;
}) {
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null);
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null);

  const handleImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.target as HTMLImageElement;
    setNaturalWidth(img.naturalWidth);
    setNaturalHeight(img.naturalHeight);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {naturalWidth && naturalHeight ? (
          <Image
            src={image.cloudinaryUrl}
            alt="Selected"
            width={naturalWidth}
            height={naturalHeight}
            className="w-full h-auto object-contain"
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="w-full h-full bg-gray-300"></div>
        )}
      </div>
    </div>
  );
}
