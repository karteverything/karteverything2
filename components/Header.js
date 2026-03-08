"use client";

import { useState} from "react";
import Link from "next/link";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="header">

            {/* logo */}
            <Link href="/" className="logo">
                KArt Everything
            </Link>

            { /* desktop navigation */}
            <nav className="desktop-nav">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/services">Services</Link>
                <Link href="/portraiture">Portraiture</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/contact">Contact</Link>
            </nav>

            {/* mobile menu buttons */}
            <div className="menu-icons">
                <span
                    className="material-sysmbols-outlined"
                    onClick={() => setOpen(true)}
                >
                    menu
                </span>
            </div>

            {/* mobile curtain nav */}
            <div className={`curtain-nav ${open ? "open" : ""}`}>
                <span 
                className="closebtn"
                onClick={() => setOpen(false)}
                >
                    ×
                </span>
            </div>

            <nav className="curtain-content">
                <Link href="/" onClick={() => setOpen(false)}>Home</Link>
                <Link href="/about" onClick={() => setOpen(false)}>About</Link>
                <Link href="/services" onClick={() => setOpen(false)}>Services</Link>
                <Link href="/portraiture" onClick={() => setOpen(false)}>Portraiture</Link>
                <Link href="/blog" onClick={() => setOpen(false)}>Blog</Link>
                <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
            </nav>
        </header>
    );
}