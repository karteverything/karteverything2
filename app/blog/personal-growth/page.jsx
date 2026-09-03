import Link from "next/link";

export default function PersonalGrowth() {
  return (
    <section className="blog-post">
      <div className="blog-post-container">
        <h1>Personal Growth</h1>

        <div className="dates-container">
          <p id="date">Published: 13-05-2025</p>
          <p id="date">Last Edited: Sep 3, 2026</p>
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
                <td>C / C++</td>
                <td>Memory management, pointers, data structures, core concepts</td>
                <td>Strengthening low-level programming foundations</td>
              </tr>

              <tr>
                <td>JavaScript + React</td>
                <td>Modern JavaScript, React fundamentals, state, components, and application architecture</td>
                <td>Building more capable and maintainable frontend applications</td>
              </tr>

              <tr>
                <td>Python</td>
                <td>Backend development, APIs, automation, and application architecture</td>
                <td>Building practical tools and backend systems</td>
              </tr>
            </tbody>
          </table>

          <h2>Active Projects</h2>

          <ol>
            <li>
              <strong>[ karteverything ]</strong> <br />
              A dynamic version of karteverything built with Next.js. Currently
              working on the backend using FastAPI, with a focus on building a
              scalable and maintainable architecture.
            </li>

            <li>
              <strong>[ windows-network-monitor ]</strong> <br />
              A lightweight Python tool that displays real-time upload and
              download speeds directly from the Windows taskbar. The network
              monitoring functionality is currently working, with CPU, RAM, and
              other system statistics planned as the next step.
            </li>

            <li>
              <strong>[ sibitane-projects ]</strong> <br />
              A construction consulting website designed with a focus on
              professionalism, usability, and a clean presentation.
            </li>
          </ol>

          <h2>Current Goals</h2>

          <p>
            Right now, the focus is on strengthening programming fundamentals
            while continuing to build real-world projects. The goal isn't just
            to learn tools, but to understand how the systems behind them work
            and how they fit together.
          </p>
        </article>

        <Link href="/#blog" className="btn">
          Back to Blog
        </Link>
      </div>
    </section>
  );
}
