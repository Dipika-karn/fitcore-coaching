"use client";

import { useState } from "react";
import { LoaderCircle, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    goal: "",
    plan: "",
    message: "",
    website: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    // Remove previous success/error message when user edits the form
    setSubmitStatus("");
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.goal) {
      newErrors.goal = "Please select your fitness goal.";
    }

    if (!formData.plan) {
      newErrors.plan = "Please select a coaching plan.";
    }

    return newErrors;
  };

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear previous errors/status
    setErrors({});
    setSubmitStatus("");

    // Start loading
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Handle API errors
      if (!response.ok) {
        console.error("API error:", data);

        throw new Error(data.message || "Failed to submit the form.");
      }

      // Successful submission
      console.log("Lead submitted successfully:", data);

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        goal: "",
        plan: "",
        message: "",
         website: "",
      });

      // Show success message
      setSubmitStatus("success");
    } catch (error) {
      console.error("Form submission error:", error);

      // Show error message
      setSubmitStatus("error");
    } finally {
      // Always stop loading
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact-form"
      className="relative overflow-hidden py-20 md:py-24 lg:py-28"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-(--primary)">
            Get Started
          </span>

          <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-(--text) sm:text-4xl lg:text-5xl">
            Start Your
            <span className="block bg-linear-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Fitness Journey.
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-(--text-secondary) sm:text-lg">
            Tell us a little about yourself and your goals. We&apos;ll get back
            to you with the next steps.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="mx-auto mt-12 max-w-3xl rounded-(--radius-2xl) border border-(--border) bg-(--card) p-6 shadow-(--shadow-card) sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
                className="hidden"
              />
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-(--text)"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  maxLength={100}
                  className="mt-2 w-full rounded-(--radius-md) border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--primary)"
                />
                <p className="mt-1 text-xs text-(--text-muted)">
                  {formData.name.length}/100
                </p>

                {errors.name && (
                  <p className="mt-2 text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-(--text)"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  maxLength={254}
                  className="mt-2 w-full rounded-(--radius-md) border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--primary)"
                />

                <p className="mt-1 text-xs text-(--text-muted)">
                  {formData.email.length}/254
                </p>

                {errors.email && (
                  <p className="mt-2 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-semibold text-(--text)"
                >
                  WhatsApp / Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  maxLength={30}
                  className="mt-2 w-full rounded-(--radius-md) border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--primary)"
                />

                <p className="mt-1 text-xs text-(--text-muted)">
                  {formData.phone.length}/30
                </p>

                {errors.phone && (
                  <p className="mt-2 text-xs text-red-400">{errors.phone}</p>
                )}
              </div>

              {/* Goal */}
              <div>
                <label
                  htmlFor="goal"
                  className="text-sm font-semibold text-(--text)"
                >
                  Fitness Goal
                </label>

                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-(--radius-md) border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text) outline-none transition-colors focus:border-(--primary)"
                >
                  <option value="" disabled>
                    Select your goal
                  </option>

                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="strength">Build Strength</option>
                  <option value="general-fitness">General Fitness</option>
                  <option value="other">Other</option>
                </select>

                {errors.goal && (
                  <p className="mt-2 text-xs text-red-400">{errors.goal}</p>
                )}
              </div>

              {/* Plan */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="plan"
                  className="text-sm font-semibold text-(--text)"
                >
                  Interested In
                </label>

                <select
                  id="plan"
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-(--radius-md) border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text) outline-none transition-colors focus:border-(--primary)"
                >
                  <option value="" disabled>
                    Select a coaching plan
                  </option>

                  <option value="starter">Starter</option>
                  <option value="transformation">Transformation</option>
                  <option value="premium">Premium</option>
                  <option value="not-sure">I&apos;m not sure yet</option>
                </select>

                {errors.plan && (
                  <p className="mt-2 text-xs text-red-400">{errors.plan}</p>
                )}
              </div>

              {/* Message */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="text-sm font-semibold text-(--text)"
                >
                  Message{" "}
                  <span className="font-normal text-(--text-muted)">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us anything you'd like us to know..."
                  maxLength={1000}
                  className="mt-2 w-full resize-none rounded-(--radius-md) border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--primary)"
                />
                <p className="mt-1 text-xs text-(--text-muted)">
                  {formData.message.length}/1000
                </p>
              </div>
            </div>

            {/* Success Message */}
            {submitStatus === "success" && (
              <div
                role="status"
                className="rounded-(--radius-md) border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-center"
              >
                <p className="text-sm font-semibold text-emerald-400">
                  Form submitted successfully!
                </p>

                <p className="mt-1 text-sm text-(--text-secondary)">
                  Thank you for reaching out. The coach will get back to you
                  within 24 hours.
                </p>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === "error" && (
              <div
                role="alert"
                className="rounded-(--radius-md) border border-red-500/20 bg-red-500/10 px-4 py-4 text-center"
              >
                <p className="text-sm font-semibold text-red-400">
                  We couldn&apos;t submit your request.
                </p>

                <p className="mt-1 text-sm text-(--text-secondary)">
                  Please check your internet connection and try again.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-(--radius-pill) bg-(--gradient-primary) px-6 py-3.5 text-sm font-bold text-white shadow-(--shadow-primary) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-glow) active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={17}
                    strokeWidth={2.5}
                    className="animate-spin"
                  />
                  Sending...
                </>
              ) : (
                <>
                  Send Request
                  <Send size={17} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
