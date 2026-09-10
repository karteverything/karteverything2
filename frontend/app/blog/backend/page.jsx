export default function FastAPIBackend() {
    return (
        <section className="blog-post">
            <div className="blog-post-container">

                <h1>Building a FastAPI Backend</h1>

                <div className="dates-container">
                    <p>Published: 10-09-2026</p>
                    <p>Last Edited: 10-09-2026</p>
                </div>

                <article>
                    <p>
                        As my Portraiture Gallery grew, I decided to move the backend
                        functionality into a dedicated FastAPI application. This gave me
                        a cleaner separation between the frontend, API, authentication,
                        image storage, and database operations.
                    </p>

                    <p>
                        In this post, I explain how I built the FastAPI backend, connected
                        it to Supabase, handled image uploads, protected the admin
                        endpoints, and built the foundation for an admin dashboard.
                    </p>

                    <h2>Why FastAPI?</h2>

                    <p>
                        Initially, much of the gallery functionality was handled directly
                        through the frontend and Supabase. As the project became more
                        complex, I wanted a dedicated backend responsible for handling
                        business logic and communication with Supabase.
                    </p>

                    <p>
                        FastAPI was a good fit because it provides a lightweight Python
                        framework for building APIs while also providing automatic
                        documentation through Swagger UI.
                    </p>

                    <p>
                        The new architecture separates the application into different
                        responsibilities instead of allowing the frontend to communicate
                        directly with everything.
                    </p>

                    <h2>Backend Architecture</h2>

                    <p>
                        The backend is structured around FastAPI routers, configuration,
                        authentication, and Supabase integration.
                    </p>

                    <table>
                        <thead>
                        <tr>
                            <th>Component</th>
                            <th>Purpose</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr>
                            <td>FastAPI</td>
                            <td>Provides the REST API and backend application</td>
                        </tr>

                        <tr>
                            <td>Supabase</td>
                            <td>Handles the database, authentication, and storage</td>
                        </tr>

                        <tr>
                            <td>Gallery Router</td>
                            <td>Handles portrait uploads and gallery operations</td>
                        </tr>

                        <tr>
                            <td>Admin Router</td>
                            <td>Handles protected admin functionality and statistics</td>
                        </tr>

                        <tr>
                            <td>CORS</td>
                            <td>Allows the frontend to communicate with the backend</td>
                        </tr>

                        <tr>
                            <td>Configuration</td>
                            <td>Stores environment-specific settings and secrets</td>
                        </tr>
                        </tbody>
                    </table>

                    <h2>Connecting FastAPI to Supabase</h2>

                    <p>
                        The backend communicates with Supabase using the Supabase Python
                        client. Instead of putting database and storage operations directly
                        inside the React application, the FastAPI backend acts as the
                        middle layer.
                    </p>

                    <p>
                        This means the frontend can make requests to endpoints such as
                        uploading, editing, deleting, and retrieving portraits while the
                        backend handles the actual Supabase operations.
                    </p>

                    <h2>Environment Configuration</h2>

                    <p>
                        I also introduced a configuration system so sensitive values and
                        environment-specific settings are not hard-coded throughout the
                        application.
                    </p>

                    <p>
                        Values such as the Supabase URL, Supabase credentials, frontend
                        URL, and other configuration settings are loaded from environment
                        variables.
                    </p>

                    <p>
                        This is particularly useful when developing locally and deploying
                        the backend to production because the same codebase can use
                        different configuration values in each environment.
                    </p>

                    <h2>Organising the API with Routers</h2>

                    <p>
                        Instead of placing every endpoint inside the main FastAPI file,
                        I separated the API into routers.
                    </p>

                    <p>
                        The gallery router is responsible for portrait-related operations,
                        while the admin router contains functionality intended for the
                        protected administration area.
                    </p>

                    <p>
                        This keeps the main application file small and makes the backend
                        easier to maintain as more functionality is added.
                    </p>

                    <h2>Image Uploads</h2>

                    <p>
                        One of the main responsibilities of the backend is handling image
                        uploads.
                    </p>

                    <p>
                        When an image is uploaded, FastAPI receives the file as an
                        <code>UploadFile</code>. The backend can then process the image
                        before sending it to Supabase Storage.
                    </p>

                    <p>
                        The upload process involves several steps:
                    </p>

                    <ol>
                        <li>Receive the image from the admin frontend.</li>

                        <li>Validate the uploaded file.</li>

                        <li>Open and process the image using Pillow.</li>

                        <li>Remove unwanted image metadata.</li>

                        <li>Upload the processed image to Supabase Storage.</li>

                        <li>Store the image information in the database.</li>
                    </ol>

                    <h2>Removing Image Metadata</h2>

                    <p>
                        I added image processing to the backend so metadata can be removed
                        before an image is stored.
                    </p>

                    <p>
                        Using Pillow, the image is opened and processed before being
                        uploaded. This allows the backend to control exactly what version
                        of the image gets stored instead of simply accepting the original
                        file unchanged.
                    </p>

                    <p>
                        This is especially useful for a photography gallery because image
                        files can contain metadata that is not required for displaying the
                        portrait.
                    </p>

                    <h2>Tracking Storage Paths</h2>

                    <p>
                        One important improvement I made was adding a dedicated
                        <code>storage_path</code> field to the portraits database table.
                    </p>

                    <p>
                        Originally, the backend could attempt to determine which Storage
                        object to delete by looking at the image URL or filename. This is
                        fragile because URLs can change and filenames are not necessarily
                        a reliable identifier for the actual Storage object.
                    </p>

                    <p>
                        Instead, every uploaded portrait now records its exact Storage
                        path in the database.
                    </p>

                    <table>
                        <thead>
                        <tr>
                            <th>Field</th>
                            <th>Purpose</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr>
                            <td>id</td>
                            <td>Unique identifier for the portrait</td>
                        </tr>

                        <tr>
                            <td>image_url</td>
                            <td>URL used to display the image</td>
                        </tr>

                        <tr>
                            <td>storage_path</td>
                            <td>Exact location of the image inside Supabase Storage</td>
                        </tr>

                        <tr>
                            <td>title</td>
                            <td>Title of the portrait</td>
                        </tr>

                        <tr>
                            <td>created_at</td>
                            <td>Time the portrait was uploaded</td>
                        </tr>
                        </tbody>
                    </table>

                    <p>
                        This makes deletion much more reliable because the backend no
                        longer needs to guess where the file is stored.
                    </p>

                    <h2>Authentication</h2>

                    <p>
                        Because the backend contains operations such as uploading,
                        editing, and deleting portraits, these endpoints should not be
                        publicly accessible.
                    </p>

                    <p>
                        Supabase Auth is used to authenticate the administrator. After
                        logging in, the frontend receives an access token and sends that
                        token when making protected requests to the FastAPI backend.
                    </p>

                    <p>
                        The backend then verifies the authentication information before
                        allowing access to protected endpoints.
                    </p>

                    <p>
                        This means that simply knowing the API URL is not enough to perform
                        administrative operations.
                    </p>

                    <h2>Testing Authentication with Swagger</h2>

                    <p>
                        FastAPI automatically generates interactive API documentation,
                        which made testing the backend much easier.
                    </p>

                    <p>
                        Through Swagger UI, I can test individual endpoints and provide
                        authentication credentials when an endpoint requires them.
                    </p>

                    <p>
                        This was particularly useful for checking whether protected
                        endpoints correctly reject unauthenticated requests and accept
                        authenticated ones.
                    </p>

                    <h2>CORS Configuration</h2>

                    <p>
                        Since the frontend and backend are deployed separately, I also
                        needed to configure Cross-Origin Resource Sharing, commonly known
                        as CORS.
                    </p>

                    <p>
                        Without the correct CORS configuration, the browser can block
                        requests from the frontend before they even reach the API.
                    </p>

                    <p>
                        The FastAPI application therefore allows requests from the
                        appropriate frontend origins, including my local development
                        environment and production frontend.
                    </p>

                    <h2>Logging</h2>

                    <p>
                        I also introduced logging into the backend so that important
                        operations and errors can be tracked more easily.
                    </p>

                    <p>
                        Logging is useful when something goes wrong because it provides
                        information about what the backend was doing when the problem
                        occurred.
                    </p>

                    <p>
                        Instead of relying entirely on print statements, structured
                        logging provides a more appropriate approach for a production
                        application.
                    </p>

                    <h2>Admin Dashboard</h2>

                    <p>
                        With the FastAPI backend handling the core gallery operations, I
                        was able to build an admin dashboard on top of the API.
                    </p>

                    <p>
                        The dashboard can communicate with protected backend endpoints to
                        retrieve information about the gallery.
                    </p>

                    <p>
                        One of the statistics I implemented was the number of portraits
                        uploaded today. The backend calculates the beginning of the
                        current day and queries Supabase for records created from that
                        point onwards.
                    </p>

                    <p>
                        This provides the foundation for adding more dashboard statistics
                        in the future.
                    </p>

                    <h2>Handling Errors</h2>

                    <p>
                        Another advantage of moving the logic into FastAPI is that errors
                        can be handled centrally.
                    </p>

                    <p>
                        For example, the backend can return appropriate HTTP errors when
                        an image is invalid, authentication fails, a portrait cannot be
                        found, or a Supabase operation fails.
                    </p>

                    <p>
                        This gives the frontend predictable responses that it can use to
                        display useful feedback to the administrator.
                    </p>

                    <h2>The Complete Upload Flow</h2>

                    <p>
                        The complete upload process now follows a controlled flow between
                        the admin frontend, FastAPI, Supabase Storage, and the database.
                    </p>

                    <ol>
                        <li>
                            The administrator selects an image and enters a title.
                        </li>

                        <li>
                            The frontend sends the authenticated request to FastAPI.
                        </li>

                        <li>
                            FastAPI validates the request and processes the image.
                        </li>

                        <li>
                            Metadata is removed from the image.
                        </li>

                        <li>
                            The processed image is uploaded to Supabase Storage.
                        </li>

                        <li>
                            The exact Storage path is recorded.
                        </li>

                        <li>
                            The portrait metadata is inserted into the database.
                        </li>

                        <li>
                            The API returns the result to the frontend.
                        </li>

                        <li>
                            The gallery can then display the newly uploaded portrait.
                        </li>
                    </ol>

                    <h2>Conclusion</h2>

                    <p>
                        Moving the gallery functionality into a FastAPI backend has made
                        the project much more structured and maintainable.
                    </p>

                    <p>
                        The frontend is now responsible primarily for the user interface,
                        while FastAPI handles the application's backend logic and
                        communication with Supabase.
                    </p>

                    <p>
                        The backend now provides a foundation for authentication, image
                        processing, reliable Storage management, database operations,
                        logging, error handling, and administrator functionality.
                    </p>

                    <p>
                        What started as a simple portrait gallery has therefore evolved
                        into a small full-stack application with a dedicated API,
                        authenticated administration system, database, and cloud storage.
                    </p>
                </article>

                <a href="/#blog" className="btn">
                    Back to Blog
                </a>
            </div>
        </section>
    );
}