export default function Supabase() {
    return (
        <section className="blog-post">
            <div className="blog-post-container">

                <h1>Supabase Integration</h1>

                <div className="dates-container">
                    <p>Published: 21-10-2025</p>
                    <p>Last Edited: Mar 10, 2026</p>
                </div>

                <article>
                    <p>
                        See how I integrated Supbase database for my Portraiture Gallery.
                        This post explains the setup, database structure, and fetching images dynamically.
                    </p>

                    <h2>Setting Up Supabase</h2>
                    <p>
                        First, I created a Supabase project that acts as a container and
                        setup my database. My table for storing the images looks like this:
                    </p>

                    <table>
                        <thead>
                        <tr>
                            <th>Data</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr>
                            <td>id</td>
                            <td>uuid</td>
                            <td>Primary key, auto-generated</td>
                        </tr>

                        <tr>
                            <td>image_url</td>
                            <td>text</td>
                            <td>Supabase Storage URL</td>
                        </tr>

                        <tr>
                            <td>title</td>
                            <td>text</td>
                            <td>Name or title of the image</td>
                        </tr>

                        <tr>
                            <td>created_at</td>
                            <td>timestamp</td>
                            <td>When the image was uploaded</td>
                        </tr>
                        </tbody>
                    </table>

                    <p>
                        This simple database schema is enough to store all the relevant
                        details about each portrait.
                    </p>

                    <h2>Building the Admin Page</h2>
                    <ol>
                        <li>Login Authentication</li>
                        <p>
                        Using Supabase Auth, I created a secure login page so only I can
                        access the admin interface.
                        </p>

                        <li>Image Upload Form</li>
                        <p>
                        A simple form that allows me to select an image, enter a title,
                        and submit it. On submit, the image gets uploaded to Supabase
                        Storage.
                        </p>

                        <li>Image Metadata Scripting</li>
                        <p>
                        The admin form includes an image metadata stripper that removes
                        metadata immediately when I click the upload button.
                        </p>

                        <li>Database Insertion</li>
                        <p>
                        Once the image is uploaded, I insert a record in the Supabase
                        database with the new image URL and metadata.
                        </p>

                        <li>Cancel, Delete, Edit Options</li>
                        <p>
                        Before confirming the upload I can cancel it. After upload, I can
                        delete an image or edit its title directly from the admin
                        dashboard, and the changes immediately reflect in the database.
                        </p>

                        <li>Shuffle Feature</li>
                        <p>
                        This feature shuffles the slideshow images on every page load.
                        </p>
                    </ol>

                    <h2>Displaying the Gallery</h2>
                    <p>
                        Once the images are in the database, displaying them is
                        straightforward. I query the database for all images and map them
                        to my gallery layout, then render them in a simple grid in the
                        frontend.
                    </p>

                    <h2>Conclusion</h2>

                    <p>
                        Integrating Supabase has simplified my workflow. Instead of editing
                        static HTML files, I can simply log in, upload a portrait, and
                        submit the form. The combination of secure authentication,
                        structured database storage, and hosted images makes Supabase a
                        perfect fit for my portraiture gallery.
                    </p>
                </article>

                <a href="/#blog" className="btn">
                    Back to Blog
                </a>
            </div>
        </section>
    );
}