import { useEffect, useState } from "react";
import { getGallery } from "../lib/api";

export default function Portraiture() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadGallery = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getGallery();

            // Shuffle gallery images
            const shuffled = [...data];

            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));

                [shuffled[i], shuffled[j]] = [
                    shuffled[j],
                    shuffled[i],
                ];
            }

            setImages(shuffled);
        } catch (err) {
            console.error("Gallery load error:", err);
            setError("Can't load gallery.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGallery();
    }, []);

    if (loading) {
        return (
            <div className="portraiture-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="portrait-skeleton"
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="gallery-error">
                <p>{error}</p>

                <button onClick={loadGallery}>
                    Try Again
                </button>
            </div>
        );
    }

    if (!images.length) {
        return (
            <div className="gallery-empty">
                <p>No images available.</p>
            </div>
        );
    }

    return (
        <div className="portraiture-grid">
            {images.map((image) => (
                <div
                    key={image.id}
                    className="portrait-item"
                >
                    <img
                        src={image.image_url}
                        alt={image.title}
                        loading="lazy"
                    />
                </div>
            ))}
        </div>
    );
}