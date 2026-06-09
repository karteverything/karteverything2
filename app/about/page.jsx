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
                            [Python | HTML | CSS | JavaScript | NextJS]
                        </li>
                        <li>Systems Analysis and Design</li>
                        <li>Git & GitHub workflows</li>
                        <li>Database Management Systems</li>
                    </ul>
                </div>

                <div className="column bottom resume">
                    <h3>Certificates</h3>

                    <ul>
                        <li>
                            Introduction to Cybersecurity <br />
                            <small>Cisco Networking Academy</small>
                        </li>
                        <li>
                            Operating Systems Basics <br />
                            <small>Cisco Networking Academy</small>
                        </li>
                        <li>Introduction to Data Science <br />
                            <small>Cisco Networking Academy</small>
                        </li>
                        <li>
                            Introduction to Cloud Computing <br />
                            <small>Simplilearn</small>
                        </li>
                        <li>
                            Cybersecurity Fundamentals <br />
                            <small>IBM SkillsBuild</small>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}