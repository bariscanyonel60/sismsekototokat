import { BusIcon, CarIcon, EngineIcon, VanIcon } from "@/components/icons";
import type { CapabilityIcon } from "@/data/company";

export const capabilityIcons: Record<CapabilityIcon, typeof CarIcon> = {
  car: CarIcon,
  van: VanIcon,
  bus: BusIcon,
  engine: EngineIcon,
};
