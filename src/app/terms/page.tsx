import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { Scale } from "lucide-react";

// Force static generation
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Terms of Service | Invoice30Sec",
  description:
    "Terms of Service for Invoice30Sec. Read our terms and conditions for using our invoicing platform.",
  openGraph: {
    title: "Terms of Service | Invoice30Sec",
    description:
      "Terms of Service for Invoice30Sec. Read our terms and conditions for using our invoicing platform.",
    type: "website",
    url: "https://invoice30sec.com/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://invoice30sec.com/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="relative z-0 text-gray-100 min-h-screen pt-20">
      <Section id="terms" className="bg-transparent">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-primary">
              <Scale className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          </div>
          <div className="space-y-6 text-secondary-foreground leading-relaxed">
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing our website at Invoice30Sec, you agree to be bound by
              these terms of service, all applicable laws and regulations, and
              agree that you are responsible for compliance with any applicable
              local laws. If you do not agree with any of these terms, you are
              prohibited from using or accessing this site.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
              2. Pricing
            </h2>
            <p>
              Invoice30Sec uses location-based pricing to provide fair and
              accessible pricing based on your geographic location. Prices are
              displayed in your local currency and may vary by country or region
              based on local market conditions and purchasing power. We
              determine your location based on your IP address to provide you
              with region-appropriate pricing. All prices are subject to change
              without notice.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
              3. Use License
            </h2>
            <p>
              Permission is granted to temporarily download one copy of the
              materials (information or software) on Invoice30Sec&apos;s website
              for personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>modify or copy the materials;</li>
              <li>
                use the materials for any commercial purpose, or for any public
                display (commercial or non-commercial);
              </li>
              <li>
                attempt to decompile or reverse engineer any software contained
                on Invoice30Sec&apos;s website;
              </li>
              <li>
                remove any copyright or other proprietary notations from the
                materials; or
              </li>
              <li>
                transfer the materials to another person or &quot;mirror&quot;
                the materials on any other server.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
              4. Disclaimer
            </h2>
            <p>
              The materials on Invoice30Sec&apos;s website are provided on an
              &apos;as is&apos; basis. Invoice30Sec makes no warranties,
              expressed or implied, and hereby disclaims and negates all other
              warranties including, without limitation, implied warranties or
              conditions of merchantability, fitness for a particular purpose,
              or non-infringement of intellectual property or other violation of
              rights.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
              5. Limitations
            </h2>
            <p>
              In no event shall Invoice30Sec or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on Invoice30Sec&apos;s website,
              even if Invoice30Sec or a Invoice30Sec authorized representative
              has been notified orally or in writing of the possibility of such
              damage.
            </p>
          </div>
        </div>
      </Section>
    </main>
  );
}
