import { steps } from "@/data/steps";
import StepCard from "./StepCard";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-20 md:py-24 lg:py-28"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-(--primary)">
            How It Works
          </span>

          <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-(--text) sm:text-4xl lg:text-5xl">
            Your Fitness Journey,
            <span className="block bg-linear-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Made Simple.
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-(--text-secondary) sm:text-lg">
            A simple process designed to give you the structure and support
            you need at every stage.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3">

          {steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
            />
          ))}

        </div>

      </div>
    </section>
  );
}