"use client"; // for useState and client-side form

import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [status, setStatus] = useState("");

    const sendEmail = async (e) => {
        e.preventDefault();
        setStatus("Sending...");
    };

    try {
        const result = await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            formData,
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        );

        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
        console.error(error);
        setStatus("Failed to send message. Try again.");
    }

    return (
        <section id="contact" className="contact-section">
            <div className="contact-title">
                <h2>Contact Me</h2>
                <p className="que">Have questions or feedback? Share with me!</p>
            </div>

            <div className="contact-container">
                {/* left */}
                <div className="contact-left">
                    <form className="contact-form" onSubmit={sendEmail}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        />

                        <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        />

                        <textarea
                        name="message"
                        rows="3"
                        placeholder="Message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        ></textarea>

                        <button type="submit" className="btn">Send Message</button>
                    </form>
                </div>
                {/* right */}
                <div className="contact-right">
                    <h3>Contact Info</h3>
                    <p><i className="fa-solid fa-envelope"></i><span>karteverything@proton.me</span></p>
                    <p><i className="fa-solid fa-phone"></i><span>+27753586562</span></p>
                    <p><i className="fa-solid fa-location-dot"></i><span>Pretoria, Gauteng</span></p>

                    <div className="social-icons">
                        <h3>Follow Me</h3>
                        <ul>
                            <a href="https://github.com/karteverything" target="_blank" rel="noopener noreferrer">
                                <li><i className="fa-brands fa-github"></i></li>
                            </a>
                            <a href="http://www.linkedin.com/in/karteverything" target="_blank" rel="noopener noreferrer">
                                <li><i className="fa-brands fa-linkedin"></i></li>
                            </a>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}