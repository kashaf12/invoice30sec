import { Section } from "@/components/Section";
import { Hero } from "@/components/Hero";
import { PainSection } from "@/components/PainSection";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyFreelancersLoveThis } from "@/components/WhyFreelancersLoveThis";
import { HashNavigationHandler } from "@/components/HashNavigationHandler";
import { LazyValidationForm } from "@/components/LazyValidationForm";

export default function Home() {
  return (
    <main className="relative z-0 text-gray-100 overflow-x-hidden snap-container">
      <HashNavigationHandler />

      <Section id="hero" className="bg-transparent">
        <Hero />
      </Section>

      <Section id="pain">
        <PainSection />
      </Section>

      <Section id="howitworks">
        <HowItWorks />
      </Section>

      <Section id="why">
        <WhyFreelancersLoveThis />
      </Section>

      <Section id="validation">
        <LazyValidationForm />
      </Section>
    </main>
  );
}
