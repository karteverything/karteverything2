export default function About() {
    const projects = [
        {
            title: "KArt Everything",
            description:
                "A personal portfolio platform combining software development, cybersecurity, and visual art. The site includes a dynamic photography gallery and an admin system for managing gallery content.",
            technologies:
                "Next.js | React | FastAPI | Supabase | PostgreSQL",
            github: "https://github.com/yourusername/your-repository",
            demo: "https://karteverything.vercel.app/",
        },
        {
            title: "Photography Gallery",
            description:
                "A full-stack image gallery with an admin interface for uploading, renaming, and deleting images. The system uses authentication and a backend API to securely manage gallery content.",
            technologies:
                "React | FastAPI | Supabase | JavaScript",
            github: "https://github.com/yourusername/gallery",
            demo: "",
        },
        {
            title: "Cybersecurity Projects",
            description:
                "Hands-on security work exploring API security, vulnerability assessment, risk analysis, and security mitigation strategies.",
            technologies:
                "Cybersecurity | API Security | Risk Analysis",
            github: "",
            demo: "",
        },
    ];

    return (
        <section className="about-section" id="about">
            <div className="about-container container">

                <div className="column full-width">
                    <p>
                        I combine TECHNOLOGY with CREATIVITY.
                        <br />
                        <br />
                        As a developer, cybersecurity enthusiast, and informatics
                        student, I enjoy solving problems, building things, and exploring technology.
                        <br />
                        <br />
                        Whether I am writing code or behind the camera, I am all about
                        bringing ideas into fun meaningful ways.
                    </p>

                    <h2 className="section-title">About Kat</h2>
                    <small>
                        <i>Sharing stories through technology and visual art.</i>
                    </small>
                </div>

                <div className="column bottom resume">
                    <h3>Education</h3>

                    <p>
                        <strong>Diploma in Informatics</strong> <br />
                        Tshwane University of Technology <br />
                        2023 - Present
                    </p>

                    <p>
                        <strong>National Senior Certificate</strong> <br />
                        DD Mabuza Comprehensive High School <br />
                        Matric 2018
                    </p>
                </div>

                <div className="column bottom">
                    <h3>Technical Skills</h3>

                    <ul>
                        <li>
                            Languages and Frameworks: <br />
                            [ HTML | CSS | JavaScript | Python | ReactJS | FastAPI ]
                        </li>
                        <li>Systems Analysis and Design</li>
                        <li>Git & GitHub workflows</li>
                        <li>Database Management, Systems, and Design</li>
                        <li>Basic Computer Troubleshooting</li>
                        <li>Network Architecture and Security</li>
                    </ul>
                </div>

                <div className="column bottom resume">
                    <h3>Certificates</h3>

                    <ul>
                        <li>
                            <a
                                href="https://www.credly.com/badges/ff1191f8-25e3-4df5-b506-625fc249c244/public_url"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Introduction to Cybersecurity
                            </a>
                            <small>Cisco Networking Academy</small>
                        </li>

                        <li>
                            <a
                                href="https://www.credly.com/badges/7db5ff90-e044-43c9-a19a-33c6c67d7f21/public_url"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Operating Systems Basics
                            </a>
                            <small>Cisco Networking Academy</small>
                        </li>

                        <li>
                            <a
                                href="https://www.credly.com/badges/97e38071-99b4-45ad-8b9a-4799fb17e576/public_url"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Introduction to Data Science
                            </a>
                            <small>Cisco Networking Academy</small>
                        </li>

                        <li>
                            <a
                                href=""
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Introduction to Cloud Computing
                            </a>
                            <small>SkillUp | Simplilearn</small>
                        </li>

                        <li>
                            <a
                                href="https://www.credly.com/badges/72bb6a75-e346-4cfa-b716-543e10373f2a/public_url"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Cybersecurity Fundamentals
                            </a>
                            <small>IBM SkillsBuild</small>
                        </li>
                    </ul>
                </div>

                <div className="column bottom">
                    <h3>Experience</h3>

                    <p>
                        <strong>Cyber Security Intern</strong> <br />
                        Future Interns <br />
                        June 2026 - July 2026
                    </p>

                    <p>The areas I explored include:</p>

                    <ul>
                        <li>API Security Risk Analysis</li>
                        <li>
                            Identifying and assessing common security vulnerabilities
                        </li>
                        <li>
                            Security risk evaluation and mitigation strategies
                        </li>
                        <li>Technical documentation and reporting</li>
                        <li>
                            Applying cybersecurity concepts to real-world scenarios
                        </li>
                    </ul>
                </div>

                {/* PROOF OF WORK */}
                <div className="proof-of-work">
                    <div className="proof-header">
                        <h2 className="section-title">Proof of Work</h2>

                        <small>
                            <i>Projects I've built and brought to life.</i>
                        </small>
                    </div>

                    <div className="projects-grid">
                        <article className="project-card">
                            <div className="project-card-content">
                                <span className="project-number">
                                    01
                                </span>

                                <h3>Shalati Vimbela</h3>

                                <p>
                                    A web project designed and developed to bring a
                                    digital presence to the Shalati Vimbela initiative.
                                </p>

                                <small className="project-technologies">
                                    Web Development
                                </small>

                                <div className="project-links">
                                    <a
                                        href="https://shalati-vimbela.vercel.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Project ↗
                                    </a>
                                </div>
                            </div>
                        </article>

                        <article className="project-card">
                            <div className="project-card-content">
                                <span className="project-number">
                                    02
                                </span>

                                <h3>3rd Dynamic Snaps</h3>

                                <p>
                                    A dynamic photography-focused web project created
                                    to showcase visual content through a modern web
                                    experience.
                                </p>

                                <small className="project-technologies">
                                    Web Development · Photography
                                </small>

                                <div className="project-links">
                                    <a
                                        href="https://3rd-dynamic-snaps.vercel.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Project ↗
                                    </a>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    );
}