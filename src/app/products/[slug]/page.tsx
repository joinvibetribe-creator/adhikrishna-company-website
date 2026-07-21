import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { products } from "@/data/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};


export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {

  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    return {
      title: "Product Not Found | AdhiKrishna Solutions LLP",
    };
  }

  return {
    title: `${product.name} | AdhiKrishna Solutions LLP`,

    description: product.description,

    keywords: [
      product.name,
      product.category,
      "AdhiKrishna Solutions LLP",
      "AI technology",
      "software products",
      "digital solutions",
    ],

    openGraph: {
      title: `${product.name} | AdhiKrishna Solutions LLP`,
      description: product.description,
      url: `https://adhikrishnasolutions.com/products/${product.slug}`,
      siteName: "AdhiKrishna Solutions LLP",
      images: [
        {
          url: product.logo,
          width: 800,
          height: 800,
          alt: `${product.name} logo`,
        },
      ],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: `${product.name} | AdhiKrishna Solutions LLP`,
      description: product.description,
      images: [product.logo],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {

  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug
  );


  if (!product) {
    notFound();
  }


  return (
    <>
      <Navbar />

      <main>

        {/* Hero Section */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">

            <div className="flex justify-center">
              <Image
  src={product.logo}
  alt={`${product.name} logo`}
  width={240}
  height={240}
  priority
  className="h-52 w-52 object-contain"
/>
            </div>


            <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-[#8B6508]">
              {product.category}
            </p>


            <h1 className="mt-4 text-5xl font-bold text-[#0b2347]">
              {product.name}
            </h1>


            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              {product.description}
            </p>

          </div>
        </section>


        {/* Product Vision */}
        <section className="bg-[#f8fafc] py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">

            <h2 className="text-3xl font-bold text-[#0b2347]">
              Product Vision
            </h2>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-gray-600">
              {product.vision}
            </p>

          </div>
        </section>


        {/* Technology Direction */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">

            <h2 className="text-3xl font-bold text-[#0b2347]">
              Technology Direction
            </h2>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-gray-600">
              {product.technologyDirection}
            </p>

          </div>
        </section>


        {/* Innovation Focus */}
        <section className="bg-[#f8fafc] py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">

            <h2 className="text-3xl font-bold text-[#0b2347]">
              Innovation Focus
            </h2>


            <div className="mt-8 grid gap-5 md:grid-cols-2">

              {product.innovationFocus.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >

                  <p className="text-lg font-medium text-[#1e5aa8]">
                    {item}
                  </p>

                </div>
              ))}

            </div>

          </div>
        </section>


        {/* Product Information */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">

            <h2 className="text-3xl font-bold text-[#0b2347]">
              Product Information
            </h2>


            <div className="mt-8 rounded-xl border border-gray-200 bg-[#f8fafc] p-8">

              <p className="font-semibold text-[#8B6508]">
                Category
              </p>

              <p className="mt-2 text-gray-600">
                {product.category}
              </p>


              <p className="mt-6 font-semibold text-[#8B6508]">
                Overview
              </p>

              <p className="mt-2 leading-7 text-gray-600">
                {product.description}
              </p>

            </div>

          </div>
        </section>


        {/* Future Direction */}
        <section className="bg-[#0b2347] py-24">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">

            <h2 className="text-3xl font-bold text-white">
              Future Direction
            </h2>


            <p className="mx-auto mt-5 max-w-4xl text-lg leading-8 text-gray-200">
              {product.futureDirection}
            </p>

          </div>
        </section>


      </main>


      <Footer />
    </>
  );
}