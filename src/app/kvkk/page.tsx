import type { Metadata } from "next";

import { LegalPage } from "@/components/LegalPage";
import { pageSeo } from "@/data/seo";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata(pageSeo.kvkk);

export default function KvkkPage() {
  return (
    <LegalPage
      title={pageSeo.kvkk.title}
      intro="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizin işlenmesine ilişkin aydınlatma metni."
      path={pageSeo.kvkk.path}
      indexable={pageSeo.kvkk.index}
    />
  );
}
