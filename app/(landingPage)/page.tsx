import { HeroSection } from "@/components/landing/HeroSection";
import { ExperienceSection } from "@/components/landing/ExperienceSection";
import { ModulesSection } from "@/components/landing/ModulesSection";
import { DifferentialsSection } from "@/components/landing/DifferentialsSection";
import { MobileExperienceSection } from "@/components/landing/MobileExperienceSection";
import { FinancialProjectionSection } from "@/components/landing/FinancialProjectionSection";
import { CTASection } from "@/components/landing/CTASection";

export const metadata = {
  title: "Academia Caxueirada | A Maior Escola de Gastronomia de Angola",
  description: "Aprenda gastronomia com a maior e mais premium escola online de Angola. Aulas práticas, chefs especialistas e muito mais.",
};

export default function LandingPage() {
  return (
    <main className="bg-black text-white min-h-screen overflow-x-hidden">
      <HeroSection />
      <ExperienceSection />
      <ModulesSection />
      <DifferentialsSection />
      <MobileExperienceSection />
      <FinancialProjectionSection />
      <CTASection />
    </main>
  );
}
