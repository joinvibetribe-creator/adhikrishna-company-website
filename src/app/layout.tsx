import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { company } from "@/data/company";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adhikrishnasolutions.com"),

  title: {
    default: "AdhiKrishna Solutions LLP | Technology With Purpose",
    template: "%s | AdhiKrishna Solutions LLP",
  },

  description:
    "AdhiKrishna Solutions LLP builds AI-powered software products, digital platforms, and intelligent technology solutions across multiple industries.",

  keywords: [
    "AdhiKrishna Solutions LLP",
    "AI technology",
    "software products",
    "digital platforms",
    "enterprise AI",
    "technology solutions",
  ],

  openGraph: {
    title: "AdhiKrishna Solutions LLP | Technology With Purpose",
    description:
      "Building intelligent software products, AI-powered platforms, and digital solutions for the future.",
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
    title: "AdhiKrishna Solutions LLP | Technology With Purpose",
    description:
      "Building intelligent software products, AI-powered platforms, and digital solutions.",
    images: ["/brand/adhikrishna-logo-transparent.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",

    name: company.name,

    url: company.website,

    logo:
      "https://adhikrishnasolutions.com/brand/adhikrishna-logo-transparent.png",

    description: company.description,

    foundingDate: company.founded.toString(),

    email: company.email,

    slogan: company.tagline,

    sameAs: [],

    contactPoint: {
      "@type": "ContactPoint",
      email: company.email,
      contactType: "business inquiries",
    },

    knowsAbout: [
      "Artificial Intelligence",
      "Software Development",
      "Digital Platforms",
      "Cloud Technology",
      "Enterprise Solutions",
    ],
  };


  const websiteSchema = {
    "@context": "https://schema.org",

    "@type": "WebSite",

    name: company.name,

    url: company.website,

    description: company.description,
  };


  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col">

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />


        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />


        {children}

      </body>

    </html>
  );
}