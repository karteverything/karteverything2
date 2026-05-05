"use client";

import { useEffect, useState } from "react";

export default function usePortraits() {
    const [portraits, setPortraits] = useState([]);
    const [loading, setLoading ] = useState(true);

    const fetchPortraits = async () => {
        setLoading(true);

        const res = await fetch("/api/admin/portraits/fetch");
        const data = await res.json();

        setPortraits(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPortraits();

        window.addEventListener("portraits-uploaded", fetchPortraits);

        return () => 
            window.removeEventListener("portraits-uploaded", fetchPortraits);
    }, []);

    return { portraits, setPortraits, loading, fetchPortraits };
}