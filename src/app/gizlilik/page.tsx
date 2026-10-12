import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { homeContactHref, routes } from "@/data/navigation";
import { pageSeo } from "@/data/seo";
import { site } from "@/data/site";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata(pageSeo.privacy);

const sections: LegalSection[] = [
  {
    id: "kapsam",
    heading: "Kapsam",
    body: (
      <p>
        Bu politika, {site.name} web sitesini ziyaret ettiğinizde hangi bilgilerin işlendiğini, bu bilgilerin ne
        amaçla kullanıldığını ve haklarınızı açıklar. Site; servis hizmetlerimizi ve yedek parça kataloğumuzu
        tanıtmak, randevu ve parça taleplerinizi bize iletmenizi kolaylaştırmak için hazırlanmıştır.
      </p>
    ),
  },
  {
    id: "toplanan-bilgiler",
    heading: "Topladığımız bilgiler",
    body: (
      <>
        <p>Sitemiz üyelik veya hesap oluşturma gerektirmez. Ziyaretiniz sırasında sizden kimlik bilgisi istenmez.</p>
        <p>
          Randevu formuna yazdığınız ad soyad, araç marka / model, hizmet ve not bilgileri sunucularımıza gönderilmez
          ve sitede saklanmaz. Bu bilgiler yalnızca tarayıcınızda hazır bir WhatsApp mesajı oluşturmak için kullanılır;
          mesajı gönderip göndermemek tamamen sizin kararınızdır.
        </p>
      </>
    ),
  },
  {
    id: "whatsapp-telefon",
    heading: "WhatsApp ve telefon ile iletişim",
    body: (
      <>
        <p>
          Hazırlanan mesajı gönderdiğinizde bilgileriniz WhatsApp üzerinden bize ulaşır. Bu aşamada WhatsApp&apos;ın
          kendi gizlilik koşulları geçerlidir.
        </p>
        <p>
          Bize WhatsApp veya telefonla ilettiğiniz bilgileri yalnızca randevu, servis ve yedek parça talebinizi
          yanıtlamak ve aracınızla ilgili işlemleri yürütmek için kullanırız; reklam veya pazarlama amacıyla üçüncü
          kişilerle paylaşmayız.
        </p>
      </>
    ),
  },
  {
    id: "cerezler",
    heading: "Çerezler ve analiz araçları",
    body: (
      <p>
        Sitemizde reklam, pazarlama veya ziyaretçi analizi amaçlı çerez ve üçüncü taraf takip aracı kullanılmaz. Yazı
        tipleri ve görseller sitenin kendi sunucusundan sunulur; bu nedenle sayfaları görüntülemeniz için harici
        servislere istek gönderilmez.
      </p>
    ),
  },
  {
    id: "sunucu-kayitlari",
    heading: "Sunucu kayıtları",
    body: (
      <p>
        Sitenin barındırıldığı hizmet sağlayıcı; güvenlik, hata tespiti ve performans amacıyla IP adresi, tarayıcı
        türü ve ziyaret zamanı gibi teknik kayıtları sınırlı bir süre tutabilir. Bu kayıtlar sizi kişisel olarak
        tanımlamak için kullanılmaz.
      </p>
    ),
  },
  {
    id: "guvenlik",
    heading: "Bilgi güvenliği",
    body: (
      <p>
        Site trafiği HTTPS ile şifrelenir. Bize ilettiğiniz bilgilere yalnızca talebinizle ilgilenen çalışanlarımız
        erişir ve bu bilgiler gerekli olan süreden uzun tutulmaz.
      </p>
    ),
  },
  {
    id: "haklariniz",
    heading: "Haklarınız",
    body: (
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun 11. maddesi kapsamında; kişisel verilerinizin işlenip
        işlenmediğini öğrenme, bilgi talep etme, düzeltilmesini veya silinmesini isteme gibi haklara sahipsiniz.
        Ayrıntılar için{" "}
        <Link href={routes.kvkk} className="text-amber underline-offset-4 hover:underline">
          KVKK Aydınlatma Metni
        </Link>
        &apos;ni inceleyebilirsiniz.
      </p>
    ),
  },
  {
    id: "degisiklikler",
    heading: "Politikadaki değişiklikler",
    body: (
      <p>
        Bu politika, site veya hizmetlerimizde yapılan değişikliklere göre güncellenebilir. Güncel metin ve son
        güncelleme tarihi her zaman bu sayfada yer alır.
      </p>
    ),
  },
  {
    id: "iletisim",
    heading: "İletişim",
    body: (
      <p>
        Gizlilik politikamızla ilgili sorularınız ve haklarınıza ilişkin talepleriniz için{" "}
        <Link href={homeContactHref} className="text-amber underline-offset-4 hover:underline">
          iletişim bölümündeki
        </Link>{" "}
        kanallardan bize ulaşabilirsiniz.
      </p>
    ),
  },
];

export default function GizlilikPage() {
  return (
    <LegalPage
      title={pageSeo.privacy.title}
      intro="Web sitemizi ziyaret ettiğinizde bilgilerinizin nasıl işlendiğine ve korunduğuna dair politikamız."
      path={pageSeo.privacy.path}
      indexable={pageSeo.privacy.index}
      updatedAt="12 Ekim 2026"
      sections={sections}
    />
  );
}
