import { ChevronDown } from "lucide-react";

export default function FAQItem({
  item,
  isOpen,
  onToggle,
}) {
  return (
    <article
      className={`overflow-hidden rounded-xl border transition-all duration-300 ${
        isOpen
          ? "border-(--primary)/50 bg-(--surface)"
          : "border-(--border) bg-(--card)"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left transition-colors duration-200 hover:bg-(--card-hover) sm:px-6"
      >
        <span className="text-sm font-bold leading-6 text-(--text) sm:text-base">
          {item.question}
        </span>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-(--border-light) text-(--text-secondary) transition-transform duration-300 ${
            isOpen ? "rotate-180 bg-(--primary) text-white" : ""
          }`}
        >
          <ChevronDown size={18} />
        </span>
      </button>

      <div
        id={`faq-answer-${item.id}`}
        className={`grid transition-[grid-template-rows] duration-300 ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-7 text-(--text-muted) sm:px-6">
            {item.answer}
          </p>
        </div>
      </div>
    </article>
  );
}