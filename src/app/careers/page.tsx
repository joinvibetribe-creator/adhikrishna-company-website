import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export const metadata: Metadata = {
  title: "Careers | AdhiKrishna Solutions LLP",
  description:
    "Explore future career opportunities at AdhiKrishna Solutions LLP and join a team building AI-powered software products, digital platforms, and innovative technology solutions.",
};

const opportunities = [
  {
    title: "Software Development",
    description:
      "Work on scalable web and mobile applications using modern technologies and engineering practices.",
  },
  {
    title: "Artificial Intelligence",
    description:
      "Explore AI-powered solutions, automation, and intelligent systems that solve real-world problems.",
  },
  {
    title: "UI/UX Design",
    description:
      "Create intuitive digital experiences that combine usability, creativity, and technology.",
  },
  {
    title: "Product Engineering",
    description:
      "Help transform ideas into impactful technology products through innovation and collaboration.",
  },
];

const values = [
  "Innovation",
  "Continuous Learning",
  "Collaboration",
  "Creating Impact",
];

export default function CareersPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h1 className="text-5xl font-bold text-[#0b2347]">
              Build The Future With Us
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
              We are building a team of passionate individuals who want to
              create meaningful technology products and AI-powered solutions.
            </p>
          </div>
        </section>

        <section className="bg-[#f8fafc] py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-[#0b2347]">
              Future Opportunities
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {opportunities.map((opportunity) => (
                <div
                  key={opportunity.title}
                  className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <h3 className="text-xl font-semibold text-[#1e5aa8]">
                    {opportunity.title}
                  </h3>

                  <p className="mt-3 text-gray-600">
                    {opportunity.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <h2 className="text-3xl font-bold text-[#0b2347]">
              Our Culture
            </h2>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {values.map((value) => (
                <div
                  key={value}
                  className="rounded-full border border-gray-200 px-6 py-3 text-gray-700"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}