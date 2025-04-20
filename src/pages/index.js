
import Header from "../components/Header";
import Hero from "../components/Hero";
import HinduCulture from "../components/HinduCulture";
import Footer from "../components/Footer";
import Events from "../components/Events";
import About from "../components/About";
import Contact from "../components/Contact";
import Cards from "../components/cards";


export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Cards />
      <Events />
      <About />
      <HinduCulture />
      <Footer />
    </>
  );
}
