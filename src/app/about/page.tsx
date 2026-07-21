import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { company } from "@/data/company";


export const metadata: Metadata = {
  title: "About AdhiKrishna Solutions LLP | Building Technology Products",
  description:
    "Learn about AdhiKrishna Solutions LLP, our vision, leadership, and mission to build AI-powered software products, digital platforms, and intelligent technology solutions.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main>

        {/* Hero */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">

            <p className="text-sm font-semibold uppercase tracking-widest text-[#8B6508]">
              {company.tagline}
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-tight text-[#0b2347] md:text-6xl">
              Building Technology With Purpose
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              {company.description}
            </p>

          </div>
        </section>


        {/* Who We Are */}
        <section className="bg-[#f8fafc] py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">

            <h2 className="text-3xl font-bold text-[#0b2347]">
              Who We Are
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              AdhiKrishna Solutions LLP is a technology company focused on
              building intelligent software products, AI-powered platforms,
              and digital solutions that address real-world challenges.
            </p>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              We combine artificial intelligence, software engineering,
              and product innovation to create scalable technology
              ecosystems across multiple industries.
            </p>

          </div>
        </section>


        {/* Founder Vision */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">

            <p className="text-sm font-semibold uppercase tracking-widest text-[#8B6508]">
              Founder Vision
            </p>

            <h2 className="mt-3 text-4xl font-bold text-[#0b2347]">
              Building Technology Ecosystems For The Future
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              AdhiKrishna Solutions LLP was founded with the vision of
              creating meaningful technology solutions that combine
              artificial intelligence, software innovation, and human-centric
              design.
            </p>

            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              Our goal is to build scalable digital platforms that solve
              practical challenges and create long-term value across
              industries.
            </p>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-[#1e5aa8]">
                Ankeet Jayesh Bhatt
              </h3>

              <p className="mt-2 text-gray-600">
                Founder & CTO
                <br />
                AdhiKrishna Solutions LLP
              </p>
            </div>

          </div>
        </section>


        {/* Leadership & Partners */}
        <section className="bg-[#f8fafc] py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <div className="text-center">

              <p className="text-sm font-semibold uppercase tracking-widest text-[#8B6508]">
                Leadership
              </p>

              <h2 className="mt-3 text-4xl font-bold text-[#0b2347]">
                Leadership & Partners
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
                Building the foundation of AdhiKrishna Solutions LLP through
                technology vision, strategic guidance, and operational
                excellence.
              </p>

            </div>


            <div className="mt-12 grid gap-8 md:grid-cols-3">


              <div className="rounded-xl bg-white p-6 shadow-sm">

                <h3 className="text-xl font-semibold text-[#1e5aa8]">
                  Ankeet Jayesh Bhatt
                </h3>

                <p className="mt-2 text-sm font-medium text-[#8B6508]">
                  Founder & CTO
                </p>

                <p className="mt-4 text-gray-600">
                  Responsible for product vision, technology strategy,
                  architecture, and innovation direction.
                </p>

              </div>


              <div className="rounded-xl bg-white p-6 shadow-sm">

                <h3 className="text-xl font-semibold text-[#1e5aa8]">
                  Jayesh V. Bhatt
                </h3>

                <p className="mt-2 text-sm font-medium text-[#8B6508]">
                  Co-Founder & Designated Partner
                </p>

                <p className="mt-4 text-gray-600">
                  Providing strategic guidance and supporting the
                  foundation and growth of the organisation.
                </p>

              </div>


              <div className="rounded-xl bg-white p-6 shadow-sm">

                <h3 className="text-xl font-semibold text-[#1e5aa8]">
                  Kinnery Jayesh Bhatt
                </h3>

                <p className="mt-2 text-sm font-medium text-[#8B6508]">
                  Designated Partner
                </p>

                <p className="mt-4 text-gray-600">
                  Supporting business operations, revenue initiatives,
                  and organisational development.
                </p>

              </div>


            </div>

          </div>
        </section>


        {/* Technology Philosophy */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <div className="text-center">

              <p className="text-sm font-semibold uppercase tracking-widest text-[#8B6508]">
                Our Approach
              </p>

              <h2 className="mt-3 text-4xl font-bold text-[#0b2347]">
                Technology Philosophy
              </h2>

            </div>


            <div className="mt-12 grid gap-8 md:grid-cols-3">

              <div className="rounded-xl border bg-white p-6 shadow-sm">

                <h3 className="text-xl font-semibold text-[#1e5aa8]">
                  AI First Thinking
                </h3>

                <p className="mt-3 text-gray-600">
                  Exploring artificial intelligence to create smarter
                  solutions and meaningful digital experiences.
                </p>

              </div>


              <div className="rounded-xl border bg-white p-6 shadow-sm">

                <h3 className="text-xl font-semibold text-[#1e5aa8]">
                  Product Innovation
                </h3>

                <p className="mt-3 text-gray-600">
                  Building technology products designed to solve practical
                  problems across industries.
                </p>

              </div>


              <div className="rounded-xl border bg-white p-6 shadow-sm">

                <h3 className="text-xl font-semibold text-[#1e5aa8]">
                  Scalable Engineering
                </h3>

                <p className="mt-3 text-gray-600">
                  Creating reliable software platforms using modern
                  engineering practices.
                </p>

              </div>

            </div>

          </div>
        </section>


        {/* Vision Mission Values */}
        <section className="bg-[#f8fafc] py-20">

          <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3 lg:px-8">


            <div className="rounded-xl bg-white p-6 shadow-sm">

              <h3 className="text-xl font-semibold text-[#1e5aa8]">
                Vision
              </h3>

              <p className="mt-3 text-gray-600">
                {company.vision}
              </p>

            </div>


            <div className="rounded-xl bg-white p-6 shadow-sm">

              <h3 className="text-xl font-semibold text-[#1e5aa8]">
                Mission
              </h3>

              <p className="mt-3 text-gray-600">
                {company.mission}
              </p>

            </div>


            <div className="rounded-xl bg-white p-6 shadow-sm">

              <h3 className="text-xl font-semibold text-[#1e5aa8]">
                Values
              </h3>

              <p className="mt-3 text-gray-600">
                Innovation, integrity, excellence, and creating meaningful
                impact through technology.
              </p>

            </div>


          </div>

        </section>


      </main>

      <Footer />
    </>
  );
}