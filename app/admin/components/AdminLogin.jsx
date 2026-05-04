"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import useLockout from "../hooks/useLockout";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const { locked, lockUntil, registerFailure, clearLock } = useLockout();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if(data.session) router.push("/admin/dashboard");
    });
  }, []);

  const handleLogin = async () => {
    if(locked) {
      const remain = Math.ceil((lockUntil - Date.now()) / 1000);
      setMsg(`Locked. Try again in ${remain}s`);
      return;
    }

    setMsg("Logging in...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      registerFailure();
      setMsg(error.message);
      return;
    }

    clearLock();
    router.push("/admin/dashboard");
  };

  return (
    <section className="card">
      <h1>Portraiture Admin</h1>

      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
      <p>{msg}</p>
    </section>
  );
}