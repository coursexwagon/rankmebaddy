"use client";

import HeroSection from "@/components/hero";
import AgitationSection from "@/components/agitation";
import SolutionSection from "@/components/solution";
import ProofSection from "@/components/proof";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AgitationSection />
      <SolutionSection />
      <ProofSection />
    </main>
  );
}
