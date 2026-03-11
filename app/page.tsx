import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Gallery from "../components/Gallery";
import Blog from "../components/BlogPreview";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Blog />
      <Contact />
    </>
  );
}
