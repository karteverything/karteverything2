"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});

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

  // Automatically move to the next image
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (!images.length) {
    return (
      <div className="portraiture-slider loading">
        <div className="slider-skeleton"></div>
        <div className="slider-skeleton"></div>
        <div className="slider-skeleton"></div>
      </div>
    );
  }

  /*
   * Get an image relative to the current image.
   * This allows the carousel to loop infinitely.
   */
  const getImage = (offset) => {
    return images[
      (currentIndex + offset + images.length) % images.length
    ];
  };

  const previousImage = getImage(-1);
  const currentImage = getImage(0);
  const nextImage = getImage(1);

  return (
    <div className="portraiture-slider">

      <div className="slider-track">

        {/* Previous image */}
        <div
          className="slide side-slide previous-slide"
          onClick={goToPrevious}
        >
          <img
            src={previousImage.image_url}
            alt={previousImage.title ?? ""}
            loading="lazy"
            decoding="async"
            onLoad={() => handleImageLoad(previousImage.id)}
          />

          <div className="slide-overlay"></div>
        </div>

        {/* Main image */}
        <div className="slide main-slide">
          {!loadedImages[currentImage.id] && (
            <div className="image-skeleton"></div>
          )}

          <img
            src={currentImage.image_url}
            alt={currentImage.title ?? ""}
            loading="eager"
            decoding="async"
            onLoad={() => handleImageLoad(currentImage.id)}
            className={loadedImages[currentImage.id] ? "loaded" : ""}
          />

          <div className="slide-caption">
            {currentImage.title ?? ""}
          </div>
        </div>

        {/* Next image */}
        <div
          className="slide side-slide next-slide"
          onClick={goToNext}
        >
          <img
            src={nextImage.image_url}
            alt={nextImage.title ?? ""}
            loading="lazy"
            decoding="async"
            onLoad={() => handleImageLoad(nextImage.id)}
          />

          <div className="slide-overlay"></div>
        </div>

      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            className="slider-arrow slider-arrow-left"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            &#10094;
          </button>

          <button
            className="slider-arrow slider-arrow-right"
            onClick={goToNext}
            aria-label="Next image"
          >
            &#10095;
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="slider-dots">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`slider-dot ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  );
}
