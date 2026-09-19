"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { navigationLinks } from "@/data/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-(--border) bg-[rgba(2,8,23,0.82)] backdrop-blur-xl">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="#home"
          onClick={closeMenu}
          className="group flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--gradient-primary) shadow-(--shadow-primary)">
            <span className="text-sm font-extrabold text-white">F</span>
          </div>

          <div className="leading-none">
            <span className="block text-base font-extrabold tracking-tight text-(--text)">
              FitCore
            </span>

            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-(--text-muted)">
              Coaching
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="
                text-sm
                font-medium
                text-(--text-secondary)
                transition-colors
                duration-200
                hover:text-(--text)
              "
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Link
            href="#contact"
            className="
              inline-flex
              items-center
              gap-2
              rounded-(--radius-pill)
              bg-(--gradient-primary)
              px-5
              py-2.5
              text-sm
              font-bold
              text-white
              shadow-(--shadow-primary)
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-(--shadow-glow)
            "
          >
            Get Started
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            border
            border-(--border)
            bg-(--surface)
            text-(--text)
            transition-colors
            duration-200
            hover:bg-(--card-hover)
            lg:hidden
          "
        >
          {isOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-(--border) bg-[rgba(2,8,23,0.96)] lg:hidden"
        >
          <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="
                    rounded-lg
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-(--text-secondary)
                    transition-colors
                    duration-200
                    hover:bg-(--surface)
                    hover:text-(--text)
                  "
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="#contact"
                onClick={closeMenu}
                className="
                  mt-2
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-(--radius-pill)
                  bg-(--gradient-primary)
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-(--shadow-primary)
                "
              >
                Get Started
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}