"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/common/Logo";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Technology", href: "/technology" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        <Link href="/" aria-label="AdhiKrishna Solutions LLP Home">
          <Logo />
        </Link>


        <nav className="hidden items-center gap-8 md:flex">

          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-[#0b2347] transition hover:text-[#1e5aa8]"
            >
              {item.name}
            </Link>
          ))}

        </nav>


        <button
          type="button"
          className="text-2xl text-[#0b2347] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

      </div>


      {open && (
        <nav className="border-t border-gray-200 bg-white px-6 py-6 md:hidden">

          <div className="flex flex-col gap-5">

            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-[#0b2347]"
              >
                {item.name}
              </Link>
            ))}

          </div>

        </nav>
      )}

    </header>
  );
}