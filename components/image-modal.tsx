"use client";

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

  // Function to handle image loading and get natural dimensions
  const handleImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.target as HTMLImageElement;
    setNaturalWidth(img.naturalWidth); // Get natural width of the image
    setNaturalHeight(img.naturalHeight); // Get natural height of the image
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
          // Using regular <img> tag for modal to display full original dimensions
          <img
            src={image.cloudinaryUrl}
            alt="Selected"
            width={naturalWidth}
            height={naturalHeight}
            className="w-full h-auto object-contain"
            onLoad={handleImageLoad}
          />
        ) : (
          // If still loading, show a placeholder or skeleton
          <div className="w-full h-full bg-gray-300"></div>
        )}
      </div>
    </div>
  );
}
