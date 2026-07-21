import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";

export default function ProductShowcase() {
  return (
    <section className="bg-[#f8fafc] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#8B6508]">
            Our Products
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#0b2347]">
            Our Innovation Ecosystem
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            Building technology products across AI, social platforms,
            mobility, enterprise solutions, and digital experiences.
          </p>
        </div>


        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.name}
              href={`/products/${product.slug}`}
              className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

          <div className="flex h-40 items-center justify-center overflow-hidden">
  <Image
    src={product.logo}
    alt={`${product.name} logo`}
    width={180}
    height={180}
    className="h-32 w-32 object-contain"
  />
</div>


              <p className="mt-5 text-sm font-medium uppercase tracking-wide text-[#8B6508]">
                {product.category}
              </p>


              <h3 className="mt-4 text-2xl font-semibold text-[#1e5aa8]">
                {product.name}
              </h3>

            </Link>
          ))}
        </div>


        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex rounded-lg bg-[#1e5aa8] px-8 py-3 font-medium text-white transition hover:bg-[#0b2347]"
          >
            Explore Products →
          </Link>
        </div>

      </div>
    </section>
  );
}