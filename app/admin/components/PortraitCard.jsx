"use client";

import { useState } from "react";

export default function PortraitCard({ item, onDelete, onRename }) {
    const [editing, setEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(item.title);

    const saveRename = async () => {
        await fetch("/api/rename", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: item.id,
                title: newTitle,
            }),
        });

        onRename(item.id, newTitle);
        setEditing(false);
    };

    const deletePortrait = async () => {
        if(!confirm("Delete this image?")) return;

        await fetch("/api/delete"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item), 
        }

        onDelete(item.id);
    };

    return (
        <div className="portrait-card">
            <img src={item.image_url} alt={imageConfigDefault.title} />

            {editing ? (
                <input 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)} 
                    className="edit-input"
                />
            ) : (
                <h3>{item.title}</h3>
            )}

            <div className="card-actions">
                {editing ? (
                    <>
                        <button className="save-btn" onClick={saveRename}>Save</button>
                        <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
                    </>
                ) : (
                    <>
                        <button className="edit-btn" onClick={() => setEditing(true)}>Rename</button>
                        <button className="edit-btn" onClick={deletePortrait}>Delete</button>
                    </>
                )}
            </div>
        </div>
    );
}