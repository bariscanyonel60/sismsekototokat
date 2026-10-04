import { About } from "@/components/About";
import { AppointmentCTA } from "@/components/AppointmentCTA";
import { Brands } from "@/components/Brands";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ImageBreak } from "@/components/ImageBreak";
import { RevealObserver } from "@/components/RevealObserver";
import { ServiceProcess } from "@/components/ServiceProcess";
import { Services } from "@/components/Services";
import { VehicleTypes } from "@/components/VehicleTypes";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WhyUs } from "@/components/WhyUs";
import { buildAutoRepairSchema } from "@/lib/structuredData";

export default function HomePage() {
  const schema = buildAutoRepairSchema();

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
        <VehicleTypes />
        <Brands />
        <WhyUs />
        <ServiceProcess />
        <ImageBreak />
        <AppointmentCTA />
      </main>
      <Footer />
      <WhatsAppButton />
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
