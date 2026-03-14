import Link from "next/link";
import { blogPosts } from "../../data/blogPosts";

export default function BlogPage() {
    return (
        <section className="blog-container container">
            <div className="blog-title">
                <h2>Blog</h2>
                <p>Thoughts, tutorials, insights, and stories behind my work.</p>
            </div>

            <div className="blog-grid">
                {blogPosts.map((post) => (
                <div key={post.slug} className="blog-card">
                    <h3>{post.title}</h3>
                    <p className="blog-snippet">{post.snippet}</p>
                    <p className="blog-date">Published: {post.published}</p>
                    <Link href={post.path} className="btn">Read Article</Link>
                </div>
                ))}
            </div>
        </section>
    );
}