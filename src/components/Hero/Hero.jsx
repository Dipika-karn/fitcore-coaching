import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl"
      />

      {/* Hero content */}
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-6 md:py-24 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
        {/* Left Content */}
        <div>
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-(--border) bg-(--surface) px-4 py-2">
            <span className="mr-2 h-2 w-2 rounded-full bg-(--primary)" />
            <span className="text-xs font-semibold uppercase tracking-wider text-(--text-secondary)">
              Personalized Fitness Coaching
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-(--text) sm:text-5xl lg:text-6xl">
            Transform Your Body.
            <span className="mt-1 block bg-linear-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Transform Your Life.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-base leading-7 text-(--text-secondary) sm:text-lg">
            Get personalized fitness coaching designed around your goals,
            lifestyle and schedule. Build strength, improve your fitness and
            create habits that last.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-(--radius-pill) bg-(--gradient-primary) px-6 py-3.5 text-sm font-bold text-white shadow-(--shadow-primary) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-glow)"
            >
              Get Started
            </Link>

            <Link
              href="#program"
              className="inline-flex items-center justify-center rounded-(--radius-pill) border border-(--border) bg-(--surface) px-6 py-3.5 text-sm font-bold text-(--text) transition-colors duration-200 hover:border-(--primary) hover:bg-(--card-hover)"
            >
              Explore Program
            </Link>
          </div>

          {/* Benefits */}
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="text-(--primary)">✓</span>
              <span className="text-sm text-(--text-muted)">
                Personalized Plans
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-(--primary)">✓</span>
              <span className="text-sm text-(--text-muted)">
                Expert Guidance
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-(--primary)">✓</span>
              <span className="text-sm text-(--text-muted)">
                Ongoing Support
              </span>
            </div>
          </div>
        </div>

        {/* Right Image Area */}
        <div className="relative mx-auto w-full max-w-xl">
          {/* Image glow */}
          <div
            aria-hidden="true"
            className="absolute inset-10 rounded-full bg-purple-600/20 blur-3xl"
          />

          {/* Image placeholder */}
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
            <Image
              src="/images/hero/hero-coach.png"
              alt="Fitness coach helping clients reach their fitness goals"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
