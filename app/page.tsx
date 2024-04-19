import NavbarHome from "./components/pages/landing/NavbarHome";
import Hero from "./components/pages/landing/Hero";
import FeatureCards from "./components/pages/landing/feature-cards";
import CTA from "./components/pages/landing/cta";

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
