import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export const metadata: Metadata = {
  title: "Contact AdhiKrishna Solutions LLP | Technology Partnerships",
  description:
    "Contact AdhiKrishna Solutions LLP for business inquiries, partnerships, collaborations, and discussions about AI-powered software products and technology solutions.",
};

const contacts = [
  {
    title: "General Inquiries",
    email: "contact@adhikrishnasolutions.com",
    description:
      "For business inquiries, partnerships, and general communication.",
  },
  {
    title: "Administration",
    email: "admin@adhikrishnasolutions.com",
    description:
      "For administrative communication and company-related matters.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h1 className="text-5xl font-bold text-[#0b2347]">
              Let's Build Something Meaningful
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
              Connect with AdhiKrishna Solutions LLP for business
              opportunities, partnerships, and technology collaborations.
            </p>
          </div>
        </section>

        <section className="bg-[#f8fafc] py-20">
          <div className="mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-2 lg:px-8">
            {contacts.map((contact) => (
              <div
                key={contact.title}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <h2 className="text-2xl font-semibold text-[#1e5aa8]">
                  {contact.title}
                </h2>

                <p className="mt-3 text-gray-600">
                  {contact.description}
                </p>

                <a
                  href={`mailto:${contact.email}`}
                  className="mt-5 inline-block font-medium text-[#0b2347]"
                >
                  {contact.email}
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <h2 className="text-3xl font-bold text-[#0b2347]">
              Partnership Opportunities
            </h2>

            <p className="mt-4 text-gray-600">
              We welcome conversations with businesses, innovators, and
              organizations interested in building impactful technology
              solutions.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}