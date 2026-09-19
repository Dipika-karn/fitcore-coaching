import Image from "next/image";
import Link from "next/link";

export default function Coach() {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-20 md:py-24 lg:py-28"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 md:gap-16 lg:grid-cols-2 lg:px-8">

        {/* Coach Image */}
        <div className="relative mx-auto w-full max-w-lg">
          {/* Decorative glow */}
          <div
            aria-hidden="true"
            className="absolute inset-8 rounded-full bg-purple-600/20 blur-3xl"
          />

          {/* Image container */}
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-(--border) bg-(--surface)">
            <Image
              src="/images/coach/coach.png"
              alt="Fitness coach"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div>
          {/* Section label */}
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-(--primary)">
            About Your Coach
          </span>

          {/* Heading */}
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-(--text) sm:text-4xl lg:text-5xl">
            Coaching That Fits
            <span className="block bg-linear-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Your Lifestyle.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-6 max-w-xl text-base leading-7 text-(--text-secondary) sm:text-lg">
            Fitness should work with your lifestyle, not against it. Get
            practical guidance and a personalized approach designed around
            your goals, fitness level and schedule.
          </p>

          {/* Benefits */}
          <div className="mt-8 space-y-4">

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--primary)/15 text-sm font-bold text-(--primary)">
                ✓
              </div>

              <div>
                <h3 className="text-sm font-bold text-(--text)">
                  Personalized Approach
                </h3>

                <p className="mt-1 text-sm leading-6 text-(--text-muted)">
                  Training and guidance adapted to your individual goals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--primary)/15 text-sm font-bold text-(--primary)">
                ✓
              </div>

              <div>
                <h3 className="text-sm font-bold text-(--text)">
                  Sustainable Progress
                </h3>

                <p className="mt-1 text-sm leading-6 text-(--text-muted)">
                  Build realistic habits that you can maintain long term.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--primary)/15 text-sm font-bold text-(--primary)">
                ✓
              </div>

              <div>
                <h3 className="text-sm font-bold text-(--text)">
                  Ongoing Support
                </h3>

                <p className="mt-1 text-sm leading-6 text-(--text-muted)">
                  Stay accountable with guidance throughout your journey.
                </p>
              </div>
            </div>

          </div>

          {/* CTA */}
          <div className="mt-8">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-(--radius-pill) bg-(--gradient-primary) px-6 py-3.5 text-sm font-bold text-white shadow-(--shadow-primary) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-glow)"
            >
              Work With Me
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}