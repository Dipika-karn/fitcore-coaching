import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingCard({ plan }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-(--radius-xl) border p-6 transition-all duration-300 hover:-translate-y-1 ${
        plan.popular
          ? "border-(--primary)/60 bg-(--surface) shadow-(--shadow-primary)"
          : "border-(--border) bg-(--card) hover:border-(--primary)/40 hover:bg-(--card-hover)"
      }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <span className="whitespace-nowrap rounded-(--radius-pill) bg-(--gradient-primary) px-4 py-1.5 text-xs font-bold text-white shadow-(--shadow-primary)">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan information */}
      <div>
        <h3 className="text-lg font-bold text-(--text)">
          {plan.name}
        </h3>

        <p className="mt-2 min-h-12 text-sm leading-6 text-(--text-muted)">
          {plan.description}
        </p>
      </div>

      {/* Price */}
      <div className="mt-6 flex items-end gap-2">
        <span className="text-4xl font-extrabold tracking-tight text-(--text)">
          {plan.price}
        </span>

        <span className="mb-1 text-sm text-(--text-muted)">
          / {plan.period}
        </span>
      </div>

      {/* CTA */}
      <Link
        href="#contact"
        className={`mt-6 inline-flex items-center justify-center rounded-(--radius-pill) px-5 py-3 text-sm font-bold transition-all duration-200 ${
          plan.popular
            ? "bg-(--gradient-primary) text-white shadow-(--shadow-primary) hover:-translate-y-0.5 hover:shadow-(--shadow-glow)"
            : "border border-(--border-light) bg-(--surface) text-(--text) hover:border-(--primary)/50 hover:text-(--primary-hover)"
        }`}
      >
        Get Started
      </Link>

      {/* Divider */}
      <div className="my-6 h-px bg-(--border)" />

      {/* Features */}
      <ul className="space-y-4">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm text-(--text-secondary)"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--primary)/15 text-(--primary)">
              <Check size={13} strokeWidth={3} />
            </span>

            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}