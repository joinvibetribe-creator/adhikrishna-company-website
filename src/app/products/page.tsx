import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <>
      <Navbar />

      <main>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">

            <p className="text-sm font-semibold uppercase tracking-widest text-[#8B6508]">
              Product Ecosystem
            </p>

            <h1 className="mt-4 text-5xl font-bold text-[#0b2347] md:text-6xl">
              Building Technology Products That Matter
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
              AdhiKrishna Solutions LLP develops innovative software products,
              AI-powered platforms, and digital solutions across multiple
              industries.
            </p>

          </div>
        </section>


        <section className="bg-[#f8fafc] py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {products.map((product) => (
                <Link
                  key={product.name}
                  href={`/products/${product.slug}`}
                  className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 transition hover:-translate-y-1 hover:shadow-lg"
                >

                 <div className="flex h-40 items-center justify-center">
  <Image
    src={product.logo}
    alt={`${product.name} logo`}
    width={180}
    height={180}
    className="h-36 w-36 object-contain"
  />
</div>


                  <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-[#8B6508]">
                    {product.category}
                  </p>


                  <h2 className="mt-4 text-3xl font-semibold text-[#1e5aa8]">
                    {product.name}
                  </h2>


                  <p className="mt-5 leading-7 text-gray-600">
                    {product.description}
                  </p>


                  <div className="mt-6 border-t pt-5">

                    <h3 className="text-sm font-semibold text-[#0b2347]">
                      Product Vision
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                      {product.vision}
                    </p>

                  </div>


                </Link>
              ))}

            </div>

          </div>
        </section>


        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">

            <h2 className="text-3xl font-bold text-[#0b2347]">
              Future Innovation Roadmap
            </h2>

            <p className="mt-4 text-gray-600">
              We continue exploring opportunities in artificial intelligence,
              automation, mobility, enterprise technology, and digital
              platforms to build solutions for the future.
            </p>

          </div>
        </section>


      </main>

      <Footer />
    </>
  );
}