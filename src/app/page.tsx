import { About } from "@/components/About";
import { AppointmentCTA } from "@/components/AppointmentCTA";
import { Brands } from "@/components/Brands";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ImageBreak } from "@/components/ImageBreak";
import { JsonLd } from "@/components/JsonLd";
import { PartsTeaser } from "@/components/PartsTeaser";
import { RevealObserver } from "@/components/RevealObserver";
import { ServiceProcess } from "@/components/ServiceProcess";
import { Services } from "@/components/Services";
import { StickyContact } from "@/components/StickyContact";
import { VehicleTypes } from "@/components/VehicleTypes";
import { WhyUs } from "@/components/WhyUs";
import { hasGallery, WorkshopGallery } from "@/components/WorkshopGallery";
import { getGallery } from "@/lib/content/store";
import type { GalleryPhoto } from "@/lib/content/types";
import { buildAutoRepairSchema, buildWebSiteSchema } from "@/lib/structuredData";

/** 01–07 sabit bölümler; galeri yalnızca içerik varken numara alır. */
function trailingIndices(photos: GalleryPhoto[]) {
  let next = 8;
  const take = () => String(next++).padStart(2, "0");
  return {
    gallery: hasGallery(photos) ? take() : "",
    faq: take(),
    contact: take(),
  };
}

export default async function HomePage() {
  const { photos } = await getGallery();
  const index = trailingIndices(photos);

  return (
    <>
      <a href="#icerik" className="skip-link">
        İçeriğe geç
      </a>
      <Header />
      <main id="icerik">
        <Hero />
        <About />
        <Services />
        <PartsTeaser />
        <VehicleTypes />
        <Brands />
        <WhyUs />
        <ServiceProcess />
        <ImageBreak />
        <WorkshopGallery index={index.gallery} photos={photos} />
        <Faq index={index.faq} />
        <AppointmentCTA index={index.contact} />
      </main>
      <Footer />
      <StickyContact />
      <RevealObserver />
      <JsonLd data={buildAutoRepairSchema()} />
      <JsonLd data={buildWebSiteSchema()} />
    </>
  );
}
