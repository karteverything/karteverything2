"use client"; // for useState and client-side form

import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin } from "react-icons/fa";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";

export default function Contact() {

    // validation helper function
    const validateForm = (data) => {
        // simple email regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.name.trim() || data.name.lenth < 3) {
            return "Please enter a valid name (at least 3 characters).";
        }
        if (!emailRegex.test(data.email)) {
            return "Please enter a valid email address.";
        }
        if (!data.subject.trim() || data.subject.length < 5) {
            return "Please enter a valid subject (at least 5 characters).";
        }
        if (!data.message.trim() || data.message.length < 10) {
            return "Please enter a valid message (at least 10 characters).";
        }
        return null; // no errors
    }

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    // for success/error message
    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. run custom validation
        const validationError = validateForm(formData);
        if (validationError) {
            // show error toast
            toast.error(validationError);
            // stop form submission
            return;
        }
        // 2. proceed with sending email if validation passes
        toast.loading("Sending message...");

        try {
            const result = await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                formData,
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
            );
            console.log(result.text);

            // remove loading toast
            toast.dismiss();

            // message send toast
            toast.success("Message sent successfully!", {
                autoClose: 3000,
            });

            // reset form
            setFormData({ name: "", email: "", subject: "", message: "" });

        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error("Failed to send message. Try again.");
        }
    };

    return (
        <section id="contact" className="contact-section">

            {/* message toaster */}
            <Toaster />

            <div className="contact-title">
                <h2>Contact Me</h2>
                <p className="que">Have a business inquiry, questions or feedback? Share with me!</p>
            </div>

            <div className="contact-container">
                {/* left */}
                <div className="contact-left">
                    <form className="contact-form" onSubmit={handleSubmit}>
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
                        minLength={10}
                        value={formData.message}
                        onChange={handleChange}
                        ></textarea>

                        <button type="submit" className="btn">Send Message</button>
                    </form>
                </div>
                {/* right */}
                <div className="contact-right">
                    <h3>Contact Info</h3>
                    <p>
                        <FaEnvelope />
                        <span>karteverything@proton.me</span>
                    </p>

                    <p>
                        <FaPhone />
                        <span>+27753586562</span>
                    </p>

                    <p>
                        <FaMapMarkerAlt />
                        <span>Pretoria, Gauteng</span>
                    </p>

                    <div className="social-icons">
                        <h3>Follow Me</h3>
                        <ul>
                            <li>
                                <a 
                                    href="https://github.com/karteverything" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    <FaGithub />
                                </a>
                            </li>

                            <li>
                                <a 
                                    href="https://www.linkedin.com/in/karteverything" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    <FaLinkedin />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}