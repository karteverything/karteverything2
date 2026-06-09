export default function About() {
    return (
        <section className="about-section" id="about">
            <div className="about-container container">

                <div className="column full-width">
                    <h2 className="section-title">About Kat</h2>

                    <p>
                        I build websites, and capture moments through photography.
                        Whether I'm coding or behind the camera, I'm all about bringing ideas to life
                        fun, meaningful ways.
                    </p>
                </div>

                <div className="column bottom">
                    <h3>Technical Skills</h3>

                    <ul>
                        <li>
                            Languages and Frameworks: <br />
                            [Python | HTML | CSS | JavaScript | NextJS]
                        </li>
                        <li>Systems Analysis and Design</li>
                        <li>Git & GitHub workflows</li>
                        <li>Database Management Systems</li>
                    </ul>
                </div>

                <div className="column bottom resume">
                    <h3>Get In Touch</h3>
                    <p>Interested in working together?</p>
                    <a href="#contact" className="btn">Contact Me</a>
                </div>
            </div>
        </section>
    );
}