import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ProductShowcase from "@/components/sections/ProductShowcase";
import TechnologySection from "@/components/sections/TechnologySection";


export const metadata: Metadata = {
  title: "AdhiKrishna Solutions LLP | AI Software Products & Digital Solutions",

  description:
    "AdhiKrishna Solutions LLP builds AI-powered software products, intelligent platforms, and digital solutions across industries including social technology, mobility, enterprise AI, and emerging technologies.",

  keywords: [
    "AdhiKrishna Solutions LLP",
    "AI software products",
    "technology solutions",
    "digital platforms",
    "enterprise AI",
    "software innovation",
  ],

  openGraph: {
    title:
      "AdhiKrishna Solutions LLP | AI Software Products & Digital Solutions",

    description:
      "Building intelligent software products, AI-powered platforms, and technology solutions that solve real-world challenges.",

    url: "https://adhikrishnasolutions.com",

    siteName: "AdhiKrishna Solutions LLP",

    images: [
      {
        url: "/brand/adhikrishna-logo-transparent.png",
        width: 1200,
        height: 630,
        alt: "AdhiKrishna Solutions LLP",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "AdhiKrishna Solutions LLP | AI Software Products & Digital Solutions",

    description:
      "Building intelligent software products, AI-powered platforms, and digital solutions for the future.",

    images: [
      "/brand/adhikrishna-logo-transparent.png",
    ],
  },
};


export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <ProductShowcase />
        <TechnologySection />
      </main>

      <Footer />
    </>
  );
}