import { features } from "@/data/features";
import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section
      id="program"
      className="relative overflow-hidden py-20 md:py-24 lg:py-28"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-(--primary)">
            Your Goals, Your Plan
          </span>

          <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-(--text) sm:text-4xl lg:text-5xl">
            Everything You Need to
            <span className="block bg-linear-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Reach Your Goals.
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-(--text-secondary) sm:text-lg">
            Get the guidance, structure and support you need to make
            consistent progress.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
            />
          ))}
        </div>

      </div>
    </section>
  );
}