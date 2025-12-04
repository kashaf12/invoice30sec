import dynamic from "next/dynamic";
import { Section } from "@/components/Section";
import { Hero } from "@/components/Hero";
import { HashNavigationHandler } from "@/components/HashNavigationHandler";

// Lazy load below-the-fold components for better performance
const PainSection = dynamic(
  () =>
    import("@/components/PainSection").then((mod) => ({
      default: mod.PainSection,
    })),
  {
    loading: () => <div className="min-h-[600px]" />,
  }
);

const HowItWorks = dynamic(
  () =>
    import("@/components/HowItWorks").then((mod) => ({
      default: mod.HowItWorks,
    })),
  {
    loading: () => <div className="min-h-[600px]" />,
  }
);

const WhyFreelancersLoveThis = dynamic(
  () =>
    import("@/components/WhyFreelancersLoveThis").then((mod) => ({
      default: mod.WhyFreelancersLoveThis,
    })),
  {
    loading: () => <div className="min-h-[600px]" />,
  }
);

const ValidationForm = dynamic(
  () =>
    import("@/components/ValidationForm").then((mod) => ({
      default: mod.ValidationForm,
    })),
  {
    loading: () => <div className="min-h-[600px]" />,
  }
);

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
        <ValidationForm />
      </Section>
    </main>
  );
}
