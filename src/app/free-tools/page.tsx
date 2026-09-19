import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { freeTools } from "@/data/freeTools";

export const metadata: Metadata = {
  title: "Free Business Tools | AdhiKrishna Solutions LLP",
  description:
    "Free business calculators, diagnostic tools and business intelligence utilities from AdhiKrishna Solutions LLP.",
  keywords: [
    "free business tools",
    "business calculator",
    "profit margin calculator",
    "markup calculator",
    "break even calculator",
    "business intelligence",
    "AdhiKrishna Solutions LLP",
    "Katya_AI",
  ],
  openGraph: {
    title: "Free Business Tools | AdhiKrishna Solutions LLP",
    description:
      "Practical business calculators, diagnostic tools and business intelligence utilities from AdhiKrishna Solutions LLP.",
    url: "https://adhikrishnasolutions.com/free-tools",
    siteName: "AdhiKrishna Solutions LLP",
    type: "website",
  },
};

export default function FreeToolsPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#8B6508]">
              Free Business Tools
            </p>

            <h1 className="mt-4 text-5xl font-bold text-[#0b2347] md:text-6xl">
              Practical Tools for Better Business Decisions
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              AdhiKrishna Solutions LLP provides practical tools that help
              businesses understand their numbers, performance and data.
            </p>

            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-500">
              These tools are designed to provide useful calculations,
              indicators and analytical observations based on the information
              you provide.
            </p>
          </div>
        </section>

        <section className="bg-[#f8fafc] py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {freeTools.map((tool) => {
                const isAvailable = tool.status === "available";

                return (
                  <div
                    key={tool.slug}
                    className="flex flex-col rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#8B6508]">
                      {tool.category}
                    </p>

                    <h2 className="mt-4 text-2xl font-semibold text-[#1e5aa8]">
                      {tool.name}
                    </h2>

                    <p className="mt-4 flex-1 leading-7 text-gray-600">
                      {tool.shortDescription}
                    </p>

                    {tool.katyaConnection === "katya" && (
                      <p className="mt-5 text-sm font-medium text-[#0b2347]">
                        Business intelligence tool connected to the principles
                        behind Katya_AI.
                      </p>
                    )}

                    <div className="mt-6">
                      {isAvailable ? (
                        <Link
                          href={tool.href}
                         className="inline-flex rounded-lg bg-[#1e5aa8] px-6 py-3 font-medium text-white transition hover:bg-[#0b2347]"
                        >
                          Use Tool
                        </Link>
                      ) : (
                        <span className="inline-flex rounded-lg border border-gray-300 bg-gray-50 px-6 py-3 font-medium text-gray-500">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#8B6508]">
              From Free Intelligence to Enterprise Intelligence
            </p>

            <h2 className="mt-4 text-3xl font-bold text-[#0b2347] md:text-4xl">
              Explore the Thinking Behind Katya_AI
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-600">
              Some of our business intelligence tools are designed around the
              same principles behind Katya_AI, our enterprise intelligence
              platform. The free tools provide focused utilities, while
              Katya_AI is being developed to connect business data and uncover
              deeper relationships and insights.
            </p>

            <Link
              href="/products/katya-ai"
              className="mt-8 inline-flex rounded-lg bg-[#1e5aa8] px-8 py-3 font-medium text-white transition hover:bg-[#0b2347]"
            >
              Explore Katya_AI
            </Link>
          </div>
        </section>

        <section className="bg-[#f8fafc] py-16">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 className="text-xl font-semibold text-[#0b2347]">
              Important Information
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              These tools provide calculations, indicators or analytical
              observations based on the information entered by the user. They
              are intended for informational purposes and should not be treated
              as professional financial, accounting, legal or investment advice.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}