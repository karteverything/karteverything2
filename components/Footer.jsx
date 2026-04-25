"use client"
import { useState, useEffect } from "react";

export default function Footer() {
    const[date, setDate] = useState("");

    useEffect(() => {
        setDate(new Date().toString().split(" GMT")[0]);
    });
    
    return (
        <footer className="footer-container">
            <div className="bottom-bar">

                <a href="">
                    &copy; KArt Everything
                </a>

                <p>{date}</p>
            </div>
        </footer>
    );
}