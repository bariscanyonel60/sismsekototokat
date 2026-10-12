import type { Metadata } from "next";
import type { ReactNode } from "react";

import { site } from "@/data/site";

export const metadata: Metadata = {
  title: { default: `Yönetim Paneli`, template: `%s | ${site.name} Yönetim` },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-bone-100 text-ink">{children}</div>;
}
