"use client";

import { useState } from "react";
import { faqItems } from "@/data/faq";
import FAQItem from "./FAQItem";

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  const handleToggle = (id) => {
    setOpenId((currentId) =>
      currentId === id ? null : id
    );
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden py-20 md:py-24 lg:py-28"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-(--primary)">
            FAQ
          </span>

          <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-(--text) sm:text-4xl lg:text-5xl">
            Frequently Asked
            <span className="block bg-linear-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Questions.
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-(--text-secondary) sm:text-lg">
            Everything you need to know about the coaching program.
          </p>
        </div>

        {/* FAQ list */}
        <div className="mt-12 space-y-4 lg:mt-16">
          {faqItems.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}