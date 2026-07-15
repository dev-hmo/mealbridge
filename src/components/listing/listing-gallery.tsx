"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";

interface ListingGalleryProps {
  photos: string[];
  title: string;
}

export function ListingGallery({ photos, title }: ListingGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-6xl">
        🍽️
      </div>
    );
  }

  return (
    <>
      {/* Main photo */}
      <div
        className="relative h-64 md:h-96 bg-gray-100 rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => setSelectedPhoto(photos[0])}
      >
        <img
          src={photos[0]}
          alt={title}
          className="w-full h-full object-cover"
        />
        {photos.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full">
            1 / {photos.length} — Click to expand
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setSelectedPhoto(photo)}
              className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-green-500 transition-colors"
            >
              <img
                src={photo}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen modal */}
      <Modal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        title={title}
      >
        {selectedPhoto && (
          <img
            src={selectedPhoto}
            alt={title}
            className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
          />
        )}
        {photos.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedPhoto(photo)}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 ${
                  selectedPhoto === photo
                    ? "border-green-500"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={photo}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}
