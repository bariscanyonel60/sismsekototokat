import Image from "next/image";

import logo from "@/assets/brand/simsek-oto-logo.png";
import { site } from "@/data/site";

interface LogoProps {
  /** Yüksekliği belirler; genişlik orana göre hesaplanır. */
  className?: string;
  sizes?: string;
  preload?: boolean;
}

export function Logo({ className = "h-[80px]", sizes = "120px", preload = false }: LogoProps) {
  return (
    <Image
      src={logo}
      alt={`${site.name} – Yedek Parça · Servis logosu`}
      sizes={sizes}
      preload={preload}
      className={`w-auto select-none ${className}`}
    />
  );
}
