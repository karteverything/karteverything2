

export default function VulnerabilityAssessment() {
    return (
        <section className="blog-post">
            <div className="blog-post-container">

                <h1>KArt Everything Vulnerability Assessment</h1>

                <div className="dates-container">
                    <p>Published: 11-06-2026</p>
                    <p>Last Edited: 11-06-2026</p>
                </div>

                <article>
                    <p>
                        As part of my Cyber Security Internship with <a href="">Future Interns,</a> I completed
                        a vulnerability assessment on this personal portfolio website, KArt Everything. The 
                        objective was to identify potential security weaknesses. understand how security testing tools
                        work, and gain practical experience in vulnerability assessment. 
                    </p>

                    <h2>Assessment Scope</h2>
                    <p>
                        Since I own and maintain KArt Everything, I had authorization to perform security testing on the
                        application. The assessment focused on identifying exposed services, reviewing website security
                        configurations, and analyzing potential vulnerabilities. 
                    </p>

                    <h2>Tools Used</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Tool</th>
                                <th>Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Nmap</td>
                                <td>Network and port scanning</td>
                            </tr>
                            <tr>
                                <td>OWASP ZAP</td>
                                <td>Web application vulnerability scanning</td>
                            </tr>
                            <tr>
                                <td>Chrome Developer Tools</td>
                                <td>Website Inspection and security analysis</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2>Nmap Assessment</h2>
                    <p>
                        Nmap was used to identify exposed ports and running services. 
                        This helped me understand which services are visible externally and 
                        whether any unnecessary exposure exists.
                    </p>
                    <p>
                        The scan confirmed that the website was accessible as expected,
                        while also providing insight into the network footprint of the 
                        application. 
                    </p>

                    <h2>OWASP ZAP Assessment</h2>
                    <p>
                        OWASP ZAP was used to perform an automated scan of the web application.
                        The scan focused on identifying common web security issues such as missing 
                        security headers, information disclosure risks, and oonfiguration weaknesses.
                    </p>
                    <p>
                        The report highlighted several areas where security could be improved. While no
                        critical vulnerabilities were identified, the findings reinforced the importance of
                        implementing security best practices during development. 
                    </p>

                    <h2>Chrome DevTools Review</h2>
                    <p>
                        Chrome DevTools was used to inspect network requests, browser behavior, page resources,
                        and security-related configurations. This provided additional insight into how the website
                        behaves from a client-side perspective. 
                    </p>
                    <p>
                        Reviewing the website through DevTools helped me better understand performance, resource loading.
                        and browser-level security configurations.
                    </p>

                    <h2>Key Findings</h2>
                    <ol>
                        <li>Several security headers could be strengthened or added.</li>
                        <li>Regular dependency updates should be implemented.</li>
                        <li>Continous security testing should be incorporated into development workflows.</li>
                        <li>No critical vulnerabilities were identified during the assessment. </li>
                    </ol>

                    <h2>Recommmendations and Risk Mitigation Strategies</h2>
                    <ol>
                        <li>Implement additional HTTP security headers.</li>
                        <li>Kep project dependencies updates.</li>
                        <li>Perform regular vulnerability assessments.</li>
                        <li>Continue applying secure development practices.</li>
                    </ol>

                    <h2>What I Learned</h2>
                    <p>
                        One of the biggest lessons from this assessment was that cybersecurity is 
                        not a seperated activity from software development. Security should be considered
                        throughout the entire development lifecyle rather than only after an application
                        has been destroyed. 
                    </p>
                    <p>
                        This task also gave me hands-on experience with industry security tools and helped
                        me better understand how security professionals evaluate web applications. 
                    </p>

                    <h2>Conclusion</h2>
                    <p>
                        Completing this vulnerability assessment was a valuable learning experience and a 
                        great introduction to practical cybersecurity work. It allowed me to evaluate my own project
                        from a security perspective and identify areas of improvement.
                    </p>
                    <p>
                        As I continue my Cyber Security Internship journey, I look forward to building on these
                        skills and applying security principles to future projects.
                    </p>
                </article>

                <a href="/#blog" className="btn">
                    Back to Blog
                </a>
            </div>
        </section>
    );
}