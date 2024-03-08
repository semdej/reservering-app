import NavbarHome from "./components/NavbarHome";
import Hero from "./components/Hero";
import FeatureCards from "./components/feature-cards";
import CTA from "./components/cta";

export default function Home() {
  return (
    <div>
      <NavbarHome />
      <Hero />
      <FeatureCards />
      <CTA />
    </div>
  );
}
