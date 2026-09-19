import Image from "next/image";
import { Star } from "lucide-react";

export default function TestimonialCard({ testimonial }) {
  return (
    <article
      className={`group rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-glow) ${
        testimonial.featured
          ? "border-(--primary)/50 bg-(--surface)"
          : "border-(--border) bg-(--card) hover:border-(--primary)/40 hover:bg-(--card-hover)"
      }`}
    >
      {/* Rating */}
      <div
        className="flex items-center gap-1"
        aria-label={`${testimonial.rating} out of 5 stars`}
      >
        {Array.from({ length: testimonial.rating }).map((_, index) => (
          <Star
            key={index}
            size={16}
            fill="currentColor"
            className="text-yellow-400"
          />
        ))}
      </div>

      {/* Review */}
      <p className="mt-5 min-h-24 text-sm leading-7 text-(--text-secondary)">
        “{testimonial.review}”
      </p>

      {/* Divider */}
      <div className="my-6 h-px bg-(--border)" />

      {/* Person */}
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-(--border-light)">
          <Image
            src={testimonial.image}
            alt={`${testimonial.name} profile`}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>

        <div>
          <h3 className="text-sm font-bold text-(--text)">
            {testimonial.name}
          </h3>

          <p className="mt-1 text-xs text-(--text-muted)">
            {testimonial.role}
          </p>
        </div>
      </div>
    </article>
  );
}