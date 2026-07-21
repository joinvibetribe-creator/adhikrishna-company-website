import Link from "next/link";
import { company } from "@/data/company";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex min-h-[650px] max-w-7xl flex-col items-center justify-center px-6 text-center lg:px-8">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#8B6508]">
          {company.tagline}
        </p>

        <h1 className="max-w-5xl text-5xl font-bold tracking-tight text-[#0b2347] md:text-6xl lg:text-7xl">
          {company.headline}
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
          {company.description}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/products"
            className="rounded-lg bg-[#1e5aa8] px-8 py-3 font-medium text-white transition hover:bg-[#0b2347]"
          >
            Explore Products
          </Link>

          <Link
  href="/about"
  className="rounded-lg border border-[#1e5aa8] px-8 py-3 font-medium text-[#1e5aa8] transition hover:bg-[#f5f7fb]"
>
  About AdhiKrishna Solutions
</Link>
        </div>
      </div>
    </section>
  );
}