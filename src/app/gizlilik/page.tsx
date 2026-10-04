import type { Metadata } from "next";

import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  robots: { index: false, follow: true },
  alternates: { canonical: "/gizlilik" },
};

export default function GizlilikPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası"
      intro="Web sitemizi ziyaret ettiğinizde bilgilerinizin nasıl işlendiğine ve korunduğuna dair politikamız."
    />
  );
}
