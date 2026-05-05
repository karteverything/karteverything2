"use client";

import usePortraits from "../hooks/usePortraits";
import PortraitCard from "./PortraitCard";

export default function PortraitGallery() {
    const { portraits, setPortraits, loading } = usePortraits();

    const handleDelete = (id) => {
        setPortraits((prev) => prev.filter((p) => p.id !== id));
    };

    const handleRename = (id, title) => {
        setPortraits((prev) => 
            prev.map((p) => (p.id === id ? { ...p, title } : p))
        );
    };

    if(loading) return <section className="card">Loading gallery...</section>;

    return (
        <section className="card gallery-card">
            <div className="gallery-header">
                <h2>G A L L E R Y</h2>
            </div>

            <div className="grid">
                {portraits.map((item) => (
                    <PortraitCard 
                        key={item.id}
                        item={item}
                        onDelete={handleDelete}
                        onRename={handleRename}
                    />
                ))}
            </div>
        </section>
    );
}