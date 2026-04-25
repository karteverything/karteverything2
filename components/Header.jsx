"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="header">
      <Link href="#home" className="logo">KArt Everything</Link>
      
      {/* desktop nav */}
      <nav className="desktop-nav">
        <Link href="#home">Home</Link>
        <Link href="#about">About</Link>
        <Link href="#services">Services</Link>
        <Link href="#portraiture">Portraiture</Link>
        <Link href="#blog">Blog</Link>
        <Link href="#contact">Contact</Link>
      </nav>

      {/* mobile curtain nav */}
      <div 
        className="curtain-nav" 
        style={{ height: isOpen ? "100%" : "0" }}
      >
        <button className="closebtn" onClick={toggleMenu}>&times;</button>
        <nav className="curtain-content">
          <Link href="#home" onClick={toggleMenu}>Home</Link>
          <Link href="#about" onClick={toggleMenu}>About</Link>
          <Link href="#services" onClick={toggleMenu}>Services</Link>
          <Link href="#portraiture" onClick={toggleMenu}>Portraiture</Link>
          <Link href="#blog" onClick={toggleMenu}>Blog</Link>
          <Link href="#contact" onClick={toggleMenu}>Contact</Link>
        </nav>
      </div>

      <div className="menu-icons" onClick={toggleMenu}>
        <span className="material-symbols-outlined">menu</span>
      </div>
    </header>
  );
}