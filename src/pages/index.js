import Header from "./src/components/Header";
import Hero from "./src/components/Hero";
import QuickSearch from "./src/components/QuickSearch";
import FeaturedProfiles from "./src/components/FeaturedProfiles";
import HinduCulture from "./src/components/HinduCulture";
import Footer from "./src/components/Footer";


export default function Home() {
  return (
    <>
    <Header />
      <Hero />
      <QuickSearch />
      <FeaturedProfiles />
      <HinduCulture />
      <Footer />
    </>
  );
}
