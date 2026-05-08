"use client";

import HeroSection from "@/components/hero";
import AgitationSection from "@/components/agitation";
import SolutionSection from "@/components/solution";
import SkillsSection from "@/components/skills";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AgitationSection />
      <SolutionSection />
      <SkillsSection />
    </main>
  );
}
