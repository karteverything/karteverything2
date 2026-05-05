"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import useAutoLogout from "../hooks/useAutoLogout";

export default function SessionGuard({ children }) {
    const router = useRouter();

    useAutoLogout();

    useEffect(() => {
        supabase.auth.session.then(({ data }) => {
            if(!data.session) {
                router.push("/admin");
            }
        });
    }, [router]);

    return children;
}