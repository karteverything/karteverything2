"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { clearTimeout } from "timers";

export default function useAutoLogout() {
    const router = useRouter();
    const AUTO_LOGOUT_TIME = 30 * 60 * 1000;

    useEffect(() => {
        let logoutTimer;

        const resetTimer = () => {
            clearTimeout(logoutTimer);

            logoutTimer = setTimeout(async () => {
                alert("Session expired due to inactivity.");
                
                await supabase.auth.signOut();

                router.push("/admin");
            }, AUTO_LOGOUT_TIME)
        };

        ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach((evt) => 
            document.addEventListener(evt, resetTimer)
        );

        return () => {
            clearTimeout(logoutTimer);
        };
    }, [router]);
}