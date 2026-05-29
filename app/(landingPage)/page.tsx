import { Hero } from "./_components/Hero";
import { ModulesSection } from "./_components/ModulesSection";
import { FeaturesSection } from "./_components/FeaturesSection";
import { CTASection } from "./_components/CTASection";

export const metadata = {
  title: "Academia Caxueirada | A Maior Escola de Gastronomia de Angola",
  description: "Aprenda gastronomia com a maior e mais premium escola online de Angola. Aulas práticas, chefs especialistas e muito mais.",
};

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Hero />
      <ModulesSection />
      <FeaturesSection />
      <div id="contato"><CTASection /></div>
    </div>
  );
}
