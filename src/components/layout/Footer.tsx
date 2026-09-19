import Image from "next/image";
import Link from "next/link";

const companyLinks = [
  { name: "About", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

const productLinks = [
  { name: "VibeTribe", href: "/products" },
  { name: "AstraJanma", href: "/products" },
  { name: "Katya_AI", href: "/products" },
  { name: "AKSA Mobility", href: "/products" },
  { name: "Adhiora Studio", href: "/products" },
];

const freeToolLinks = [
  { name: "Free Business Tools", href: "/free-tools" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Use", href: "/terms-of-use" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#0b2347] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Image
            src="/brand/adhikrishna-logo-footer.png"
            alt="AdhiKrishna Solutions LLP"
            width={360}
            height={140}
            className="h-auto w-auto max-h-32"
          />

          <p className="mt-4 text-sm text-gray-400">
            Building innovative software products and AI-powered digital
            solutions that solve real-world business challenges.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#D4AF37]">
            Company
          </h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-300">
            {companyLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#D4AF37]">
            Products
          </h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-300">
            {productLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#D4AF37]">
            Free Tools
          </h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-300">
            {freeToolLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-sm text-gray-400">
        <p>contact@adhikrishnasolutions.com</p>

        <div className="mt-3 flex justify-center gap-4">
          {legalLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <p className="mt-3">
          © {new Date().getFullYear()} AdhiKrishna Solutions LLP. All rights reserved.
        </p>
      </div>
    </footer>
  );
}