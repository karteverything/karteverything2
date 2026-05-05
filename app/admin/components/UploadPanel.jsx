"use client";

import { useState } from "react";
import { stripImageMetadata} from "@/lib/metadataStripper";
import supabase from "../../../lib/supabaseClient";

export default function UploadPanel() {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [msg, setMsg] = useState("");

    const handleFile = (e) => {
        const picked = e.target.files[0];
        if(!picked) return;

        setFile(picked);
        setPreview(URL.createObjectURL(picked));
    };

    const clearPreview = () => {
        setFile(null);
        setPreview("");
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/admin";
    };

    const handleUpload = async () => {
        if(!file || !title) {
            setMsg("Image and title required.");
            return;
        }

        setMsg("Uploading...");

        try {
            const cleanFile = await stripImageMetadata(file);

            const formData = new FormData();
            formData.append("file", cleanFile);
            formData.append("title", title);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setMsg("Upload Successful.");
            setTitle("");
            setFile(null);
            setPreview("");

            window.dispatchEvent(new Event("portrait-uploaded"));
        } catch(err) {
            setMsg(err.message);
        }
    };

    return (
        <section className="card">
            <h2 className="upload">Image Upload Portral</h2>

            <div className="form-row">
                <input 
                    type="text"
                    placeholder="Image title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="form-row">
                <input 
                    type="file"
                    onChange={{handleFile}}
                />
            </div>

            {preview && (
                <div className="preview-container">
                    <img src={preview} width="150" alt="preview" />
                </div>
            )}

            <div className="action-row">
                <button className="btn" onClick={handleUpload}>Upload</button>
                <button className="btn" onClick={handleLogout}>Logout</button>
            </div>

            <p>{msg}</p>
        </section>
    );
}