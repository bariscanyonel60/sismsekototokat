import { ArrowUpRight } from "@/components/icons";
import { site } from "@/data/site";

interface MediaCreditProps {
  className?: string;
}

export function MediaCredit({ className = "" }: MediaCreditProps) {
  const { label, name, href } = site.mediaCredit;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={`${label}: ${name} (bariscanyonel.com, yeni sekmede açılır)`}
      className={`group inline-flex items-center gap-3 rounded-sm border border-accent/50 bg-accent/10 px-4 py-2.5 transition-colors duration-300 hover:border-accent hover:bg-accent ${className}`}
    >
      <span className="label-mono text-[0.65rem] text-bone/80 transition-colors group-hover:text-white">{label}:</span>
      <span className="font-display text-lg font-bold uppercase leading-none tracking-[0.12em] text-accent-300 transition-colors group-hover:text-white">
        {name}
      </span>
      <ArrowUpRight
        size={16}
        className="text-accent transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
      />
    </a>
  );
}
