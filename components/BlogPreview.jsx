import Link from "next/link";
import { blogPosts } from "@";

const posts = [
    {
        title: "Personal Growth",
        snippet: "This page is a snapshot of what I'm currently learning, building, and improving.",
        href: "/blog/personal-growth",
    },
    {
        title: "Supabase Integration",
        snippet: "See how I integrated Supabase database for my Portraiture Gallery.",
        href: "/blog/supabase",
    },
    {
        title: "The Precision of Perfection",
        snippet: "The say perfection is a sickness, but maybe it's just love expressed with precision.",
        href: "/blog/perfection",
    },
    {
        title: "Engineering Emotion: Why I love cars",
        snippet: "From roaring engines to sleek designs, cars aren't just machines.",
        href: "/blog/cars",
    },
];

export default function BlogPreview() {
    return (
        <section id="blog" className="blog-section">
            <div className="blog-container container">

                <div className="blog-title">
                    <h2>Latest Blog Posts</h2>
                    <p>Thoughts, tutorials, insight, and stories behind my work.</p>
                </div>

                <div className="blog-grid">

                    {posts.map((post) => (
                        <div className="blog-card" key={post.href}>
                            <h3>{post.title}</h3>
                            <p className="blog-snippet">{post.snippet}</p>

                            <Link href={post.href} className="btn">
                                Read More
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}