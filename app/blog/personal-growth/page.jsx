import Link from "next/link";

export default function PersonalGrowth() {
  return (
    <section className="blog-post">
      <div className="blog-post-container">
        <h1>Personal Growth</h1>

        <div className="dates-container">
          <p id="date">Published: 13-05-2025</p>
          <p id="date">Last Edited: Apr 25, 2026</p>
        </div>

        <article>
          <p>
            This page is a snapshot of what I'm currently learning, building,
            and improving. Sharing the journey helps me stay consistent and
            reflect on how far I've come.
          </p>

          <h2>Current Learning</h2>

          <table>
            <thead>
              <tr>
                <th>Technology</th>
                <th>Focus</th>
                <th>Purpose</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>C Language</td>
                <td>Memory management, pointers, core concepts</td>
                <td>Strengthening low-level foundations</td>
              </tr>

              <tr>
                <td>JavaScript</td>
                <td>Advanced concepts, async behavior, DOM manipulation</td>
                <td>Improving frontend logic and interactivity</td>
              </tr>

              <tr>
                <td>Next.js</td>
                <td>Routing, dynamic rendering, API routes</td>
                <td>Making this site fully dynamic</td>
              </tr>
            </tbody>
          </table>

          <h2>Active Projects</h2>

          <ol>
            <li>
              <strong>[ karteverything2 ]</strong> <br />
              A dynamic version of karteverything
              built with Next.js, focusing on scalability and modern
              architecture.
            </li>

            <li>
              <strong>[ windows-nework-monitor ]</strong> <br />
              A lightweight Python tool that displays real-time upload and download speeds directly from the Windows taskbar.
            </li>

            <li>
              <strong>[ sibitane-projects ]</strong> <br />
              A construction consulting
              website designed for professionalism.
            </li>
          </ol>

          <h2>Current Goals</h2>

          <p>
            Right now, mastering foundations while building real-world
            projects. The goal isn't just to learn tools, but to understand
            systems.
          </p>
        </article>

        <Link href="/#blog" className="btn">
          Back to Blog
        </Link>
      </div>
    </section>
  );
}