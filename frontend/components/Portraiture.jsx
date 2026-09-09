"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

// fisher-yates shuffle helper
function shuffle(arr) {
  const array = [...arr];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export default function Portraiture() {
  const [images, setImages] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});

  // Number of images currently visible
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase
        .from("portraits")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error loading images:", error.message);
        return;
      }

      if (data?.length) {
        setImages(shuffle(data));
      }
    }

    fetchImages();
  }, []);

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleSeeLess = () => {
    setVisibleCount(10);
  };

  if (!images.length) {
    return (
      <div className="gallery-grid skeleton-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid-item">
            <div className="image-skeleton"></div>
          </div>
        ))}
      </div>
    );
  }

  const visibleImages = images.slice(0, visibleCount);

  return (
    <>
      <div className="gallery-grid">
        {visibleImages.map((img, index) => (
          <div
            key={img.id}
            className="grid-item"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="image-wrapper">
              {!loadedImages[img.id] && (
                <div className="image-skeleton"></div>
              )}

              <img
                src={img.image_url}
                alt={img.title ?? ""}
                loading="lazy"
                decoding="async"
                onLoad={() => handleImageLoad(img.id)}
                className={loadedImages[img.id] ? "loaded" : ""}
              />

              <div className="caption">
                {img.title ?? ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gallery controls */}
      {images.length > 10 && (
        <div className="see-more-container">

          {visibleCount < images.length ? (
            <button
              onClick={handleSeeMore}
              className="see-more-button"
            >
              See more
            </button>
          ) : (
            <button
              onClick={handleSeeLess}
              className="see-more-button"
            >
              See less
            </button>
          )}

        </div>
      )}
    </>
  );
}