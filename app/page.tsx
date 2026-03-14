import Header from "../components/Header";
import Footer from "../components/Footer";
import About from "./about/page";
import Services from "./services/page";
import Gallery from "./portraiture/page";
import BlogPreview from "./blog/page";
import Contact from "./contact/page";

export default function Home() {
  return (
    <>
      <section className="hero" id="home">
        <div className="container">
          <h1>Hi, It's Kat</h1>

          <p id="home-intro">
            This is where I blend my passions - nature through photography,
            systems development, and a little bit of everything else. 
            <span className="blue-gradient-text">{" "}
              Welcome to my journal!
            </span>
          </p>

        </div>
      </section>

      <About />
      <Services />
      <Gallery />
      <BlogPreview />
      <Contact />
    </>
  );
}
