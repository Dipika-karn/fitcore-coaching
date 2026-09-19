import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function CTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-20 md:py-24 lg:py-28"
    >
      {/* CTA Background Image */}
      <Image
        src="/images/cta/cta-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(--background)/80"
      />

      {/* Purple atmospheric glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.25),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-(--primary)/30 bg-black/30 px-6 py-12 text-center shadow-(--shadow-glow) backdrop-blur-sm sm:px-10 md:py-16 lg:px-16">
          <div className="relative">
            {/* Eyebrow */}
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-(--primary)">
              Start Your Journey
            </span>

            {/* Heading */}
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-(--text) sm:text-4xl lg:text-5xl">
              Ready to Become a
              <span className="block bg-linear-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Stronger Version of Yourself?
              </span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-(--text-secondary) sm:text-lg">
              Take the first step toward a healthier, stronger and more
              consistent lifestyle with personalized fitness coaching.
            </p>

            {/* Benefits */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3">
              <div className="flex items-center gap-2 text-sm text-(--text-secondary)">
                <CheckCircle2
                  size={17}
                  className="text-(--primary)"
                />
                Personalized guidance
              </div>

              <div className="flex items-center gap-2 text-sm text-(--text-secondary)">
                <CheckCircle2
                  size={17}
                  className="text-(--primary)"
                />
                Flexible approach
              </div>

              <div className="flex items-center gap-2 text-sm text-(--text-secondary)">
                <CheckCircle2
                  size={17}
                  className="text-(--primary)"
                />
                Ongoing support
              </div>
            </div>

            {/* CTA */}
            <div className="mt-9">
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 rounded-(--radius-pill) bg-(--gradient-primary) px-7 py-3.5 text-sm font-bold text-white shadow-(--shadow-primary) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-glow)"
              >
                Get Started Today
                <ArrowRight
                  size={17}
                  strokeWidth={2.5}
                />
              </Link>
            </div>

            {/* Supporting text */}
            <p className="mt-4 text-xs text-(--text-muted)">
              Choose the coaching plan that fits your goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}