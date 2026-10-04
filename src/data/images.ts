import type { StaticImageData } from "next/image";

import breakEngine from "@/assets/images/break-engine.jpg";
import heroWorkshop from "@/assets/images/hero-workshop.jpg";
import serviceBrake from "@/assets/images/service-brake.jpg";
import serviceDiagnostics from "@/assets/images/service-diagnostics.jpg";
import serviceEngine from "@/assets/images/service-engine.jpg";
import serviceHeavy from "@/assets/images/service-heavy.jpg";
import serviceInspection from "@/assets/images/service-inspection.jpg";
import serviceOil from "@/assets/images/service-oil.jpg";
import servicePeriodic from "@/assets/images/service-periodic.jpg";
import serviceSuspension from "@/assets/images/service-suspension.jpg";
import vehicleBus from "@/assets/images/vehicle-bus.jpg";
import vehicleCommercialWorkshop from "@/assets/images/vehicle-commercial-workshop.jpg";
import vehiclePassenger from "@/assets/images/vehicle-passenger.jpg";
import whyMechanic from "@/assets/images/why-mechanic.jpg";

export type ImageLicense = "Unsplash License" | "Pexels License";

export interface SiteImage {
  src: StaticImageData;
  alt: string;
  source: string;
  license: ImageLicense;
}

/**
 * Tüm fotoğrafların tek kaynağı. Firma kendi atölye fotoğraflarını verdiğinde
 * dosyayı `src/assets/images` altında değiştirip yalnızca bu kaydı güncellemek yeterli.
 */
export const images = {
  heroWorkshop: {
    src: heroWorkshop,
    alt: "Modern servis atölyesinde kaputu açık bir otomobil üzerinde çalışan usta",
    source: "https://unsplash.com/photos/mechanic-working-on-a-car-engine-in-a-workshop-XP8o9_Arwqg",
    license: "Unsplash License",
  },
  servicePeriodic: {
    src: servicePeriodic,
    alt: "Motor bölmesinde periyodik bakım kontrolü yapan teknisyen",
    source: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f",
    license: "Unsplash License",
  },
  serviceOil: {
    src: serviceOil,
    alt: "Otomobil motoruna yeni motor yağı dolduran usta",
    source: "https://unsplash.com/photos/mechanic-pouring-oil-into-car-engine-gW34cv-Ojjs",
    license: "Unsplash License",
  },
  serviceEngine: {
    src: serviceEngine,
    alt: "Motor parçası üzerinde el aletiyle çalışan mekanik ustası",
    source: "https://images.unsplash.com/photo-1728474751252-9c085659f6ab",
    license: "Unsplash License",
  },
  serviceHeavy: {
    src: serviceHeavy,
    alt: "Atölyede araç altında kapsamlı mekanik bakım yapan teknisyenler",
    source: "https://www.pexels.com/photo/auto-mechanics-at-work-7018506/",
    license: "Pexels License",
  },
  serviceBrake: {
    src: serviceBrake,
    alt: "Sökülmüş tekerlek arkasında fren diski ve kaliper yakın çekim",
    source: "https://unsplash.com/photos/close-up-of-a-cars-brake-rotor-and-caliper-vS2shmNei2E",
    license: "Unsplash License",
  },
  serviceSuspension: {
    src: serviceSuspension,
    alt: "Lift üzerindeki aracın altında yürüyen aksam kontrolü",
    source: "https://images.unsplash.com/photo-1702146713858-8e7d1cc29fe8",
    license: "Unsplash License",
  },
  serviceDiagnostics: {
    src: serviceDiagnostics,
    alt: "Araç içinde dizüstü bilgisayarla arıza tespiti yapan teknisyen",
    source: "https://images.unsplash.com/photo-1727893380169-4dda123e19f7",
    license: "Unsplash License",
  },
  serviceInspection: {
    src: serviceInspection,
    alt: "Lifte kaldırılmış aracın alt takımını inceleyen usta",
    source: "https://www.pexels.com/photo/man-fixing-car-in-a-garage-8985601/",
    license: "Pexels License",
  },
  vehiclePassenger: {
    src: vehiclePassenger,
    alt: "Serviste hidrolik lift üzerine kaldırılmış binek otomobil",
    source: "https://unsplash.com/photos/a-car-being-worked-on-in-a-car-repair-shop-rU_bvNfr8pQ",
    license: "Unsplash License",
  },
  vehicleBus: {
    src: vehicleBus,
    alt: "Akşam ışığında farları yanan şehirlerarası otobüs",
    source: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
    license: "Unsplash License",
  },
  vehicleCommercialWorkshop: {
    src: vehicleCommercialWorkshop,
    alt: "Atölyede ticari aracın ön motor bölmesinde çalışan teknisyen",
    source: "https://www.pexels.com/photo/a-man-checking-the-engine-6720519/",
    license: "Pexels License",
  },
  whyMechanic: {
    src: whyMechanic,
    alt: "Loş atölyede ağır vasıta parçaları üzerinde çalışan mekanik ustası",
    source: "https://www.pexels.com/photo/man-repairing-a-truck-in-a-car-service-shop-7564858/",
    license: "Pexels License",
  },
  breakEngine: {
    src: breakEngine,
    alt: "Motor üzerinde anahtarla çalışan ustanın elleri",
    source: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e",
    license: "Unsplash License",
  },
} satisfies Record<string, SiteImage>;
