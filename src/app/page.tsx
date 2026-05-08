"use client";

import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero";
import AgitationSection from "@/components/agitation";
import SolutionSection from "@/components/solution";
import ProofSection from "@/components/proof";
import PricingSection from "@/components/pricing";
import FooterSection from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AgitationSection />
      <SolutionSection />
      <ProofSection />
      <PricingSection />
      <FooterSection />
    </main>
  );
}
