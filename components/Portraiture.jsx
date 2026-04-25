"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

// fisher-yates shuffle helper
function shuffle(arr) {
  const array = [...arr];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return array;
}

export default function Portraiture() {
  const [images, setImages] = useState([]);

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

  return (
    <div className="gallery-grid">
      {images.map((img) => (
        <div key={img.id} className="grid-item">
          <div className="image-wrapper">
            <img
              src={img.image_url}
              alt={img.title ?? ""}
              loading="lazy"
              decoding="async"
            />
            <div className="caption">
              {img.title || ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}