"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function Portraiture() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase
        .from("portraits")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setImages(data);
      }
    }

    fetchImages();
  }, []);

  if (!images.length) return <p>Loading gallery...</p>;

  return (
    <div className="gallery-grid">
      {images.map((img) => (
        <div key={img.id} className="gallery-item">
          <img src={img.image_url} alt={img.title || ""} />
        </div>
      ))}
    </div>
  );
}
