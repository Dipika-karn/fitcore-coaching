import {
  Apple,
  ChartNoAxesCombined,
  Dumbbell,
  Users,
} from "lucide-react";

const iconMap = {
  Dumbbell,
  Apple,
  ChartNoAxesCombined,
  Users,
};

export default function FeatureCard({ feature }) {
  const Icon = iconMap[feature.icon];

  return (
    <article className="group rounded-xl border border-(--border) bg-(--card) p-6 shadow-(--shadow-card) transition-all duration-300 hover:-translate-y-1 hover:border-(--primary)/50 hover:bg-(--card-hover) hover:shadow-(--shadow-glow)">
      
      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--primary)/15 text-(--primary) transition-colors duration-300 group-hover:bg-(--primary) group-hover:text-white">
        <Icon size={24} strokeWidth={2} />
      </div>

      {/* Content */}
      <h3 className="mt-6 text-lg font-bold text-(--text)">
        {feature.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-(--text-muted)">
        {feature.description}
      </p>
    </article>
  );
}