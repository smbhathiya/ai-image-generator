import { HeroHeader } from "@/components/hero5-header";
import Hero from "./_components/Hero";
import Features from "./_components/Features";
import HowItWorks from "./_components/HowItWorks";
import CTA from "./_components/CTA";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div>
      <HeroHeader />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
