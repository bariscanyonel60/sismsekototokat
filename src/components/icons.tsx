import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "square",
    strokeLinejoin: "miter",
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 12h17M14 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function ArrowUp(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21V4M6 10l6-6 6 6" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 7h18M3 12h18M9 17h12" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 4h2.5l2.2 11h10.6L20.5 7H7" />
      <circle cx="9" cy="19.5" r="1.25" />
      <circle cx="17" cy="19.5" r="1.25" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function EngineIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 10v6M2 13h2M4 9h3l2-2h6v2h2l2 3h3v4h-3l-2 3H8l-4-3V9Z" />
      <path d="M10 7V4h4v3M9 13h6" />
    </svg>
  );
}

export function CarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.6 16H2v-3.4l2.4-1L7.2 7h8.6l3.4 4.4 2.8.8V16h-1.6M9.4 16h5.2" />
      <path d="M6.6 11.6 8.4 8.6h3.4v3M11.8 11.6h5.4" />
      <circle cx="6.5" cy="16" r="2.1" />
      <circle cx="17.5" cy="16" r="2.1" />
    </svg>
  );
}

export function VanIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.6 17H2V7l1.6-2h11l3.8 5 3.6 1.2V17h-1.6M9.4 17h5.2" />
      <path d="M14.6 5v6h4.2M2 11h12.6M8 5v6" />
      <circle cx="6.5" cy="17" r="2.1" />
      <circle cx="17.5" cy="17" r="2.1" />
    </svg>
  );
}

export function BusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 17.5H2V4h20v13.5h-2M9 17.5h6" />
      <path d="M2 10.5h20M7.5 4v6.5M13 4v6.5M18.5 4v6.5M18.5 13.5v1.5" />
      <circle cx="6.5" cy="17.5" r="2" />
      <circle cx="17.5" cy="17.5" r="2" />
    </svg>
  );
}

export function OilIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11Z" />
      <path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5" />
    </svg>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 3v18M12 3v18M15 3v18" />
    </svg>
  );
}

export function SuspensionIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 2v3M12 19v3M8 5h8M8 19h8" />
      <path d="m8 7 8 2-8 2 8 2-8 2 8 2" />
    </svg>
  );
}

export function BrakeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M4.5 8.5A8.5 8.5 0 0 1 9 4" />
    </svg>
  );
}

export function ClutchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13 2 5 13h6l-1 9 8-11h-6l1-9Z" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 22, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} {...props}>
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.6 2 2.17 6.43 2.17 11.88c0 1.74.46 3.44 1.32 4.94L2.1 22l5.3-1.39a9.86 9.86 0 0 0 4.63 1.18h.01c5.45 0 9.88-4.43 9.88-9.88a9.8 9.8 0 0 0-2.87-7Zm-7 15.2h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.14.83.84-3.06-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.53 3.69-8.22 8.23-8.22a8.2 8.2 0 0 1 8.22 8.23c0 4.53-3.69 8.22-8.2 8.22Zm4.51-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48a.92.92 0 0 0-.66.31c-.23.25-.86.84-.86 2.06 0 1.21.88 2.38 1.01 2.55.12.16 1.74 2.66 4.21 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}
