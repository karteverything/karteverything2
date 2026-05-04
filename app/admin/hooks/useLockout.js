"use client";
import { useState, useEffect } from "react";

export default function useLockout() {
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const savedAttempts = parseInt(localStorage.getItem("failedAttempts")) || 0;
    const savedLock = parseInt(localStorage.getItem("lockUntil")) || 0;

    setFailedAttempts(savedAttempts);
    setLockUntil(savedLock);

    if (Date.now() < savedLock) setLocked(true);
  }, []);

  const registerFailure = () => {
    const attempts = failedAttempts + 1;
    setFailedAttempts(attempts);
    localStorage.setItem("failedAttempts", attempts);

    if (attempts >= 3) {
      const until = Date.now() + 60000;
      setLockUntil(until);
      setLocked(true);
      localStorage.setItem("lockUntil", until);
    }
  };

  const clearLock = () => {
    setFailedAttempts(0);
    setLockUntil(0);
    setLocked(false);
    localStorage.removeItem("failedAttempts");
    localStorage.removeItem("lockUntil");
  };

  return { locked, lockUntil, registerFailure, clearLock };
}