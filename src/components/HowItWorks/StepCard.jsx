import {
  CalendarCheck,
  ClipboardList,
  Trophy,
} from "lucide-react";

const iconMap = {
  CalendarCheck,
  ClipboardList,
  Trophy,
};

export default function StepCard({ step }) {
  const Icon = iconMap[step.icon];

  return (
    <article className="group relative rounded-(--radius-xl) border border-(--border) bg-(--card) p-6 transition-all duration-300 hover:-translate-y-1 hover:border-(--primary)/50 hover:bg-(--card-hover) hover:shadow-(--shadow-glow)">
      
      {/* Step number */}
      <div className="flex items-center justify-between">
        <span className="text-4xl font-extrabold text-(--border-light)">
          {step.id}
        </span>

        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--primary)/15 text-(--primary) transition-colors duration-300 group-hover:bg-(--primary) group-hover:text-white">
          <Icon size={24} strokeWidth={2} />
        </div>
      </div>

      {/* Content */}
      <h3 className="mt-7 text-lg font-bold text-(--text)">
        {step.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-(--text-muted)">
        {step.description}
      </p>
    </article>
  );
}