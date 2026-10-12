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
import { Reviews } from "@/components/Reviews";
import { ServiceProcess } from "@/components/ServiceProcess";
import { Services } from "@/components/Services";
import { StickyContact } from "@/components/StickyContact";
import { VehicleTypes } from "@/components/VehicleTypes";
import { WhyUs } from "@/components/WhyUs";
import { reviews } from "@/data/reviews";
import { buildAutoRepairSchema } from "@/lib/structuredData";

export default function HomePage() {
  const hasReviews = reviews.length > 0;

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
        <Reviews index="08" />
        <Faq index={hasReviews ? "09" : "08"} />
        <AppointmentCTA index={hasReviews ? "10" : "09"} />
      </main>
      <Footer />
      <StickyContact />
      <RevealObserver />
      <JsonLd data={buildAutoRepairSchema()} />
    </>
  );
}
