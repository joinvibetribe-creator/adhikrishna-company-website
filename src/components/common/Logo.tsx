import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/brand/adhikrishna-logo-navbar.png"
        alt="AdhiKrishna Solutions LLP"
        width={280}
        height={110}
        priority
        sizes="280px"
        className="h-auto w-auto max-h-16 md:max-h-20"
      />
    </div>
  );
}