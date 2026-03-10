import Link from "next/link";
import { blogPosts } from "@/data/blogPosts";

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
                        <div className="blog-card" key={post.slug}>
                            <h3>{post.title}</h3>
                            <p className="blog-snippet">{post.snippet}</p>

                            <Link href={post.path} className="btn">
                                Read More
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}