import { SectionHeading } from "@/components/SectionHeading";
import { sectionIds } from "@/data/navigation";
import { reviews, reviewsIntro, type CustomerReview } from "@/data/reviews";
import { delay } from "@/lib/cssVars";

const dateFormat = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" });

function Stars({ rating }: { rating: CustomerReview["rating"] }) {
  return (
    <span className="flex gap-1" role="img" aria-label={`5 üzerinden ${rating} puan`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={16} height={16} viewBox="0 0 24 24" aria-hidden focusable={false}>
          <path
            d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5-4.9-4.6 6.6-.8z"
            fill={i < rating ? "var(--color-amber)" : "none"}
            stroke="var(--color-amber)"
            strokeWidth={1.5}
          />
        </svg>
      ))}
    </span>
  );
}

/** Gerçek yorum girilene kadar (`reviews` boşken) hiçbir şey göstermez. */
export function Reviews({ index }: { index: string }) {
  if (reviews.length === 0) return null;

  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <section id={sectionIds.reviews} aria-labelledby="yorumlar-baslik" className="section-y noise relative bg-ink">
      <div className="container-x relative">
        <SectionHeading
          id="yorumlar-baslik"
          index={index}
          eyebrow={reviewsIntro.eyebrow}
          title={reviewsIntro.title}
          description={reviewsIntro.description}
        />

        <p className="mt-10 flex items-baseline gap-4" data-reveal>
          <span className="display text-6xl text-amber">{average.toFixed(1).replace(".", ",")}</span>
          <span className="label-mono text-steel-300">{reviews.length} değerlendirme</span>
        </p>

        <ul className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
          {reviews.map((review, i) => (
            <li key={`${review.author}-${review.date}`} data-reveal style={delay(i % 3)}>
              <figure className="flex h-full flex-col border border-bone/10 bg-anthracite/60 p-7">
                <Stars rating={review.rating} />
                <blockquote className="mt-6 flex-1 text-[1.02rem] leading-relaxed text-bone/85">
                  “{review.body}”
                </blockquote>
                <figcaption className="mt-8 border-t border-bone/10 pt-5">
                  <span className="font-display text-lg font-semibold uppercase tracking-[0.08em] text-bone">
                    {review.author}
                  </span>
                  <span className="label-mono mt-1 block text-[0.62rem] text-steel-400">
                    {[review.vehicle, dateFormat.format(new Date(review.date)), review.source]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
