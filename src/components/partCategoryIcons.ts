import type { ComponentType } from "react";

import {
  BrakeIcon,
  ClutchIcon,
  EngineIcon,
  FilterIcon,
  OilIcon,
  SparkIcon,
  SuspensionIcon,
} from "@/components/icons";
import type { CategoryIconKey } from "@/lib/catalog/types";

export const categoryIcons: Record<CategoryIconKey, ComponentType<{ size?: number; className?: string }>> = {
  engine: EngineIcon,
  oil: OilIcon,
  filter: FilterIcon,
  suspension: SuspensionIcon,
  brake: BrakeIcon,
  clutch: ClutchIcon,
  spark: SparkIcon,
};

export const categoryIconLabels: Record<CategoryIconKey, string> = {
  engine: "Motor",
  oil: "Yağ",
  filter: "Filtre",
  suspension: "Ön takım",
  brake: "Fren",
  clutch: "Debriyaj",
  spark: "Ateşleme",
};
