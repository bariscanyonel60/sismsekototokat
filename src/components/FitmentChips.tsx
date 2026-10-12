import { fitmentItems } from "@/lib/catalog/helpers";
import type { Part } from "@/lib/catalog/types";

const VISIBLE = 4;

/** Ürün kartındaki uygun marka / model çipleri; fazlası "+N" olarak özetlenir. */
export function FitmentChips({ part, className = "" }: { part: Part; className?: string }) {
  const items = fitmentItems(part);
  const shown = items.slice(0, VISIBLE);
  const rest = items.slice(VISIBLE);

  return (
    <div className={className}>
      <p className="label-mono text-[0.56rem] text-steel-500">Uygun Araçlar</p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {shown.map((item) => (
          <li key={item} className="rounded-xs border border-ink/10 bg-bone-100 px-2 py-1 text-[0.75rem] leading-none text-ink">
            {item}
          </li>
        ))}
        {rest.length > 0 && (
          <li
            title={rest.join(", ")}
            className="rounded-xs bg-ink px-2 py-1 text-[0.75rem] font-semibold leading-none text-bone"
          >
            +{rest.length}
            <span className="sr-only"> daha: {rest.join(", ")}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
