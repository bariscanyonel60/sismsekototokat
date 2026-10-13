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
import partAccessoryBelt from "@/assets/images/parts/accessory-belt.jpg";
import partAirFilter from "@/assets/images/parts/air-filter.jpg";
import partBrakeDisc from "@/assets/images/parts/brake-disc.jpg";
import partBrakeDrum from "@/assets/images/parts/brake-drum.jpg";
import partBrakePads from "@/assets/images/parts/brake-pads.jpg";
import partBrakeShoes from "@/assets/images/parts/brake-shoes.jpg";
import partCabinFilter from "@/assets/images/parts/cabin-filter.jpg";
import partClutchKit from "@/assets/images/parts/clutch-kit.jpg";
import partCvBoot from "@/assets/images/parts/cv-boot.jpg";
import partEngineCommercial from "@/assets/images/parts/engine-commercial.jpg";
import partEngineDiesel from "@/assets/images/parts/engine-diesel.jpg";
import partEngineHeavy from "@/assets/images/parts/engine-heavy.jpg";
import partEnginePetrol from "@/assets/images/parts/engine-petrol.jpg";
import partFuelFilter from "@/assets/images/parts/fuel-filter.jpg";
import partGearShift from "@/assets/images/parts/gear-shift.jpg";
import partIgnitionCoil from "@/assets/images/parts/ignition-coil.jpg";
import partOilFilter from "@/assets/images/parts/oil-filter.jpg";
import partOilJug from "@/assets/images/parts/oil-jug.jpg";
import partOilPour from "@/assets/images/parts/oil-pour.jpg";
import partShockAbsorber from "@/assets/images/parts/shock-absorber.jpg";
import partSparkPlug from "@/assets/images/parts/spark-plug.jpg";
import partSteeringKnuckle from "@/assets/images/parts/steering-knuckle.jpg";
import partStrutMount from "@/assets/images/parts/strut-mount.jpg";
import partTimingBelt from "@/assets/images/parts/timing-belt.jpg";
import partTimingEngine from "@/assets/images/parts/timing-engine.jpg";
import partWheelHub from "@/assets/images/parts/wheel-hub.jpg";

/** "Firma fotoğrafı": işletmenin kendi çektiği / hakkına sahip olduğu görsel. */
export type ImageLicense = "Unsplash License" | "Pexels License" | "Firma fotoğrafı";

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

  // Yedek parça görselleri (parça türüne göre; markaya özel ürün fotoğrafı değildir)
  partEngineDiesel: {
    src: partEngineDiesel,
    alt: "Stand üzerinde komple binek dizel motor",
    source: "https://unsplash.com/photos/a-detailed-image-of-a-ford-engine-displayed-VXerPNbzF4s",
    license: "Unsplash License",
  },
  partEnginePetrol: {
    src: partEnginePetrol,
    alt: "Sergi standında komple benzinli motor",
    source: "https://unsplash.com/photos/grey-and-black-robot-toy-YSeNTqKhASc",
    license: "Unsplash License",
  },
  partEngineCommercial: {
    src: partEngineCommercial,
    alt: "Tezgâh üzerinde volan tarafından komple motor",
    source: "https://unsplash.com/photos/a-machine-on-the-table-MTa3CHmAYxc",
    license: "Unsplash License",
  },
  partEngineHeavy: {
    src: partEngineHeavy,
    alt: "Büyük dizel motorun kasnak ve kayış tarafı",
    source: "https://unsplash.com/photos/black-and-red-generator-ef36Vao8B8g",
    license: "Unsplash License",
  },
  partOilPour: {
    src: partOilPour,
    alt: "Motora bidondan motor yağı dolduran usta",
    source: "https://unsplash.com/photos/man-refilling-motor-oil-on-car-engine-bay-V37iTrYZz2E",
    license: "Unsplash License",
  },
  partOilJug: {
    src: partOilJug,
    alt: "Motor yağı bidonu",
    source: "https://unsplash.com/photos/black-and-white-plastic-bottle-9ZTpCjmwL2M",
    license: "Unsplash License",
  },
  partOilFilter: {
    src: partOilFilter,
    alt: "Araçtan sökülen yağ filtresi",
    source: "https://unsplash.com/photos/a-mechanic-is-pouring-oil-on-a-car-uhuTo7u8VXk",
    license: "Unsplash License",
  },
  partAirFilter: {
    src: partAirFilter,
    alt: "Plili hava filtresi yakın çekim",
    source: "https://www.pexels.com/photo/air-filter-in-close-up-photography-11074558/",
    license: "Pexels License",
  },
  partCabinFilter: {
    src: partCabinFilter,
    alt: "Yeni polen (kabin) filtresi",
    source: "https://www.pexels.com/photo/a-person-holding-a-new-cabin-filter-7541975/",
    license: "Pexels License",
  },
  partFuelFilter: {
    src: partFuelFilter,
    alt: "Dizel motor üzerindeki yakıt filtresi",
    source: "https://unsplash.com/photos/close-up-of-a-dirty-fuel-filter-on-a-vehicle-jXcdwIuhqFc",
    license: "Unsplash License",
  },
  partShockAbsorber: {
    src: partShockAbsorber,
    alt: "Yaylı amortisörler",
    source: "https://unsplash.com/photos/four-car-suspension-struts-with-red-springs-xCL5K4pro7I",
    license: "Unsplash License",
  },
  partStrutMount: {
    src: partStrutMount,
    alt: "Motor bölmesinde amortisör kulesi ve takozu",
    source: "https://unsplash.com/photos/car-engine-bay-with-strut-tower-and-chrome-cap-fJtVML3dFj8",
    license: "Unsplash License",
  },
  partSteeringKnuckle: {
    src: partSteeringKnuckle,
    alt: "Ön takımda rot, rotil ve aks bağlantısı",
    source: "https://unsplash.com/photos/close-up-view-of-a-cars-suspension-system-and-wheel-RDhXpNrafIU",
    license: "Unsplash License",
  },
  partCvBoot: {
    src: partCvBoot,
    alt: "Aks kafası ve aks körüğü",
    source: "https://unsplash.com/photos/close-up-of-a-cars-suspension-and-wheel-assembly-fILglZMbipM",
    license: "Unsplash License",
  },
  partWheelHub: {
    src: partWheelHub,
    alt: "Tekerleği sökülmüş araçta porya ve teker rulmanı",
    source: "https://www.pexels.com/photo/car-without-wheel-8651900/",
    license: "Pexels License",
  },
  partBrakePads: {
    src: partBrakePads,
    alt: "Fren diski üzerinde balata ve kaliper değişimi",
    source: "https://www.pexels.com/photo/a-close-up-shot-of-a-vehicle-disc-brake-6870299/",
    license: "Pexels License",
  },
  partBrakeShoes: {
    src: partBrakeShoes,
    alt: "Atölyede fren balataları",
    source: "https://www.pexels.com/photo/metalworker-polishing-brake-pads-in-workshop-39839865/",
    license: "Pexels License",
  },
  partBrakeDisc: {
    src: partBrakeDisc,
    alt: "Fren diski ve kaliper",
    source: "https://unsplash.com/photos/gray-and-brown-round-metal-tool-fwnTOncjeB0",
    license: "Unsplash License",
  },
  partBrakeDrum: {
    src: partBrakeDrum,
    alt: "Sökülmüş fren kampanası ve pabuç sistemi",
    source: "https://www.pexels.com/photo/auto-repair-dismantled-car-brake-system-31040178/",
    license: "Pexels License",
  },
  partClutchKit: {
    src: partClutchKit,
    alt: "Debriyaj baskı ve disk seti",
    source: "https://unsplash.com/photos/red-and-black-round-device-9tzXrgjr2Oc",
    license: "Unsplash License",
  },
  partGearShift: {
    src: partGearShift,
    alt: "Manuel vites topuzu",
    source: "https://unsplash.com/photos/a-close-up-of-a-cars-gear-stick-d0c9hZMGYRk",
    license: "Unsplash License",
  },
  partTimingBelt: {
    src: partTimingBelt,
    alt: "Dişli triger kayışı",
    source: "https://unsplash.com/photos/black-and-white-strap-on-white-surface-6oy6mesrv9w",
    license: "Unsplash License",
  },
  partTimingEngine: {
    src: partTimingEngine,
    alt: "Motor üzerinde triger kayışı ve kasnaklar",
    source: "https://unsplash.com/photos/gray-and-blue-car-engine-YM5HPbFvXIU",
    license: "Unsplash License",
  },
  partAccessoryBelt: {
    src: partAccessoryBelt,
    alt: "V kayışı, gergi ve avara rulmanları",
    source: "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
    license: "Unsplash License",
  },
  partSparkPlug: {
    src: partSparkPlug,
    alt: "Yeni buji",
    source: "https://unsplash.com/photos/a-new-spark-plug-against-a-grey-background-f2fQCpiEQLM",
    license: "Unsplash License",
  },
  partIgnitionCoil: {
    src: partIgnitionCoil,
    alt: "Motor üzerinde ateşleme bobinleri",
    source: "https://unsplash.com/photos/red-and-black-car-engine-z6Zpjwp7j-s",
    license: "Unsplash License",
  },
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;

export const imageKeys = Object.keys(images) as ImageKey[];
