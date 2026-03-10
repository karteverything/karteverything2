import Link from "next/link";
import { blogPosts } from "../../data/blogPosts";

export default function BlogPage() {
    return (
        <section className="blog-list container">
            <h1>Blog</h1>

            {blogPosts.map((post) => (
                <article key={post.slug} className="blog-list-item">

                    <h2>{post.title}</h2>
                    <p>{post.snippet}</p>

                    <p className="blog-date">
                        Published: {post.published}
                    </p>

                    <Link href={post.path} className="btn">
                        Read Article 
                    </Link>
                </article>
            ))}
        </section>
    );
}