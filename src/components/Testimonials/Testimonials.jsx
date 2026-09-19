import { testimonials } from "@/data/testimonials";
import TestimonialCard from "./TestimonialCard";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-20 md:py-24 lg:py-28"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-(--primary)">
            Client Stories
          </span>

          <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-(--text) sm:text-4xl lg:text-5xl">
            Real People,
            <span className="block bg-linear-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Real Progress.
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-(--text-secondary) sm:text-lg">
            See how personalized coaching can help you build consistency,
            stay accountable and make meaningful progress.
          </p>
        </div>

        {/* Testimonials */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}