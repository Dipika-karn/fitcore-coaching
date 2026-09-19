import Link from "next/link";
import {
  ArrowUp,
  
  Mail,
  
} from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Program", href: "#program" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: FaInstagram,
  },
  {
    label: "YouTube",
    href: "#",
    icon: FaYoutube,
  },
  {
    label: "Email",
    href: "mailto:hello@fitcorecoaching.com",
    icon: Mail,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-(--border) bg-(--background-secondary)">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr] md:py-16">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="#home"
              className="inline-flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--gradient-primary) shadow-(--shadow-primary)">
                <span className="text-sm font-extrabold text-white">
                  F
                </span>
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

            <p className="mt-5 text-sm leading-6 text-(--text-muted)">
              Personalized fitness coaching designed to help you get
              stronger, feel better and build sustainable habits.
            </p>

            {/* Social links */}
<div className="mt-6 flex items-center gap-3">
  {socialLinks.map((social) => {
    const Icon = social.icon;

    return (
      <a
        key={social.label}
        href={social.href}
        aria-label={social.label}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-(--border) bg-(--surface) text-(--text-muted) transition-all duration-200 hover:border-(--primary)/50 hover:bg-(--primary)/10 hover:text-(--primary)"
      >
        <Icon size={18} />
      </a>
    );
  })}
</div>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="text-sm font-bold text-(--text)">
              Navigation
            </h2>

            <nav
              aria-label="Footer navigation"
              className="mt-5 flex flex-col gap-3"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-(--text-muted) transition-colors duration-200 hover:text-(--primary-hover)"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Get started */}
          <div>
            <h2 className="text-sm font-bold text-(--text)">
              Get Started
            </h2>

            <p className="mt-5 text-sm leading-6 text-(--text-muted)">
              Ready to start your fitness journey?
            </p>

            <Link
              href="#pricing"
              className="mt-5 inline-flex items-center justify-center rounded-(--radius-pill) bg-(--gradient-primary) px-5 py-2.5 text-sm font-bold text-white shadow-(--shadow-primary) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-glow)"
            >
              View Plans
            </Link>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="flex flex-col gap-4 border-t border-(--border) py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-(--text-muted)">
            © {new Date().getFullYear()} FitCore Coaching. All rights
            reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="#"
              className="text-xs text-(--text-muted) transition-colors duration-200 hover:text-(--text)"
            >
              Privacy Policy
            </Link>

            <Link
              href="#"
              className="text-xs text-(--text-muted) transition-colors duration-200 hover:text-(--text)"
            >
              Terms of Service
            </Link>

            <Link
              href="#home"
              aria-label="Back to top"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border) text-(--text-muted) transition-all duration-200 hover:border-(--primary)/50 hover:text-(--primary)"
            >
              <ArrowUp size={15} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}