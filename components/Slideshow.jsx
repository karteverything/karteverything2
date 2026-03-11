"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function Slideshow() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function fetchSlides() {
      const { data, error } = await supabase
        .from("portraits")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setSlides(data);
      }
    }

    fetchSlides();
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  if (!slides.length) return <p>Loading slideshow...</p>;

  return (
    <div className="slideshow-container">

      <div className="mySlides">
        <img src={slides[index].image_url} alt={slides[index].title || ""} />
        <div className="text">{slides[index].title || ""}</div>
      </div>

      <button className="prev" onClick={prevSlide}>&#10094;</button>
      <button className="next" onClick={nextSlide}>&#10095;</button>

      <button id="fullscreenToggle" className="fullscreen-btn">
        ⛶
      </button>

    </div>
  );
}