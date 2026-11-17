"use client";

import { useEffect, useRef, useState } from "react";
import supabase from "../lib/supabase";

export default function Portraiture() {
    const [images, setImages] = useState([]);
    const [loadedImages, setLoadedImages] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const galleryRef = useRef(null);

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

            setImages(data ?? []);
        }

        fetchImages();
    }, []);

    const scrollGallery = (direction) => {
        if (!galleryRef.current) return;

        galleryRef.current.scrollBy({
            left: direction * 300,
            behavior: "smooth",
        });
    };

    const handleImageLoad = (id) => {
        setLoadedImages((prev) => ({
            ...prev,
            [id]: true,
        }));
    };

    if (!images.length) {
        return (
            <div className="portraiture-gallery loading-gallery">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div className="portrait-skeleton" key={index} />
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="portraiture-section">

                <div className="portraiture-heading">
                    <span>THE COLLECTION</span>
                    <h3>Captured Moments</h3>
                </div>

                <div className="portraiture-controls">
                    <span>
                        {images.length} Photographs
                    </span>

                    <div className="gallery-arrows">
                        <button
                            onClick={() => scrollGallery(-1)}
                            aria-label="Scroll gallery left"
                        >
                            &#8592;
                        </button>

                        <button
                            onClick={() => scrollGallery(1)}
                            aria-label="Scroll gallery right"
                        >
                            &#8594;
                        </button>
                    </div>
                </div>

                <div
                    className="portraiture-gallery"
                    ref={galleryRef}
                >
                    {images.map((img) => (
                        <article
                            className="portrait-card"
                            key={img.id}
                            onClick={() => setSelectedImage(img)}
                        >
                            <div className="portrait-image">
                                {!loadedImages[img.id] && (
                                    <div className="portrait-skeleton" />
                                )}

                                <img
                                    src={img.image_url}
                                    alt={img.title || "Portrait photograph"}
                                    loading="lazy"
                                    decoding="async"
                                    onLoad={() => handleImageLoad(img.id)}
                                    className={
                                        loadedImages[img.id] ? "loaded" : ""
                                    }
                                />

                                <div className="portrait-overlay">
                                    <span>View photograph ↗</span>
                                </div>
                            </div>

                            {img.title && (
                                <div className="portrait-caption">
                                    {img.title}
                                </div>
                            )}
                        </article>
                    ))}
                </div>

                <div className="gallery-scroll-hint">
                    <span></span>
                    <p>SCROLL TO EXPLORE</p>
                    <span></span>
                </div>
            </div>

            {/* Image lightbox */}
            {selectedImage && (
                <div
                    className="portrait-lightbox"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="lightbox-close"
                        onClick={() => setSelectedImage(null)}
                        aria-label="Close photograph"
                    >
                        &times;
                    </button>

                    <div
                        className="lightbox-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.image_url}
                            alt={selectedImage.title || "Portrait photograph"}
                        />

                        {selectedImage.title && (
                            <p>{selectedImage.title}</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}