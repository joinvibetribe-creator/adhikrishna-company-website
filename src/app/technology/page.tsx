import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export const metadata: Metadata = {
  title: "Technology | AdhiKrishna Solutions LLP",
  description:
    "Explore the technology foundations behind AdhiKrishna Solutions LLP, including artificial intelligence, software engineering, cloud infrastructure, automation, and secure digital systems.",
};

const technologies = [
  {
    title: "Artificial Intelligence",
    description:
      "Developing AI-powered solutions that help businesses automate processes, generate insights, and create intelligent digital experiences.",
  },
  {
    title: "Full-Stack Software Development",
    description:
      "Building scalable web and mobile applications using modern frameworks, clean architecture, and reliable engineering practices.",
  },
  {
    title: "Cloud Infrastructure",
    description:
      "Designing secure and scalable cloud-based platforms that support modern digital products and services.",
  },
  {
    title: "Data & Automation",
    description:
      "Using data-driven systems and automation technologies to improve efficiency and business decision-making.",
  },
  {
    title: "Mobile & Web Platforms",
    description:
      "Creating user-focused digital experiences across mobile applications and responsive web platforms.",
  },
  {
    title: "Secure Digital Systems",
    description:
      "Building reliable technology platforms with security, privacy, and scalability in mind.",
  },
];

export default function TechnologyPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h1 className="text-5xl font-bold text-[#0b2347]">
              Technology That Powers Innovation
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
              Combining artificial intelligence, software engineering,
              and modern infrastructure to build future-ready digital
              solutions.
            </p>
          </div>
        </section>

        <section className="bg-[#f8fafc] py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {technologies.map((technology) => (
                <div
                  key={technology.title}
                  className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <h2 className="text-xl font-semibold text-[#1e5aa8]">
                    {technology.title}
                  </h2>

                  <p className="mt-4 text-gray-600">
                    {technology.description}
                  </p>
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