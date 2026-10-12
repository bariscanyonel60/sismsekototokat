import Image from "next/image";

import { ArrowRight } from "@/components/icons";
import { imageBreakContent } from "@/data/company";
import { sectionIds } from "@/data/navigation";
import { delay } from "@/lib/cssVars";

export function ImageBreak() {
  const words = imageBreakContent.title.split(" ");
  const splitAt = Math.ceil(words.length / 2);

  return (
    <section
      aria-labelledby="ara-baslik"
      className="relative isolate flex min-h-[82svh] items-end overflow-hidden bg-ink md:min-h-[92vh] md:items-center"
    >
      <div className="parallax-media absolute inset-0 -z-10">
        <Image
          src={imageBreakContent.image.src}
          alt={imageBreakContent.image.alt}
          fill
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-[60%_50%]"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(26_31_37/0.35)_0%,rgb(26_31_37/0.55)_45%,rgb(26_31_37/0.92)_100%)] md:bg-[linear-gradient(90deg,rgb(26_31_37/0.9)_0%,rgb(26_31_37/0.62)_45%,rgb(26_31_37/0.15)_100%)]" />

      <div className="container-x relative py-20 md:py-28">
        <div className="max-w-[920px]">
          <span className="label-mono text-accent" data-reveal>
            — Servis Yaklaşımımız
          </span>
          <h2
            id="ara-baslik"
            className="display mt-6 text-[clamp(2.7rem,7vw,6.25rem)] text-bone"
            data-reveal
            style={delay(1)}
          >
            <span className="block">{words.slice(0, splitAt).join(" ")} </span>
            <span className="block text-bone/55">{words.slice(splitAt).join(" ")}</span>
          </h2>
          <p className="lede mt-7 max-w-[34rem] text-bone/80" data-reveal style={delay(2)}>
            {imageBreakContent.description}
          </p>
          <a
            href={`#${sectionIds.contact}`}
            className="link-arrow group mt-10 border-b border-accent/60 pb-2 text-accent hover:border-accent"
            data-reveal
            style={delay(3)}
          >
            {imageBreakContent.cta}
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
