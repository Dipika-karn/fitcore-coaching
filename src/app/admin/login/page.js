"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Invalid credentials or another API error.
      if (!response.ok) {
        setErrorMessage(data.message || "Login failed.");
        return;
      }

      // The browser has received the session cookie.
      // Navigate to the admin dashboard.
      router.push("/admin/leads");
      router.refresh();
    } catch {
      setErrorMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-(--background) text-(--text) flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="rounded-(--radius-2xl) border border-(--border) bg-(--card) p-6 shadow-(--shadow-card) sm:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--primary)/10 text-(--primary)">
              <LockKeyhole size={26} />
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">FitCore Admin</h1>

            <p className="mt-2 text-sm text-(--text-muted)">
              Sign in to manage your coaching leads.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-(--text-secondary)"
              >
                Admin Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-(--radius-md) border border-(--border) bg-(--background-secondary) py-3 pl-10 pr-4 text-sm text-(--text) outline-none transition placeholder:text-(--text-muted) focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-(--text-secondary)"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-(--radius-md) border border-(--border) bg-(--background-secondary) py-3 pl-10 pr-4 text-sm text-(--text) outline-none transition placeholder:text-(--text-muted) focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
                />
              </div>
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="rounded-(--radius-md) border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {errorMessage}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-(--radius-md) bg-(--primary) px-4 py-3 text-sm font-semibold text-white transition hover:bg-(--primary-hover) active:bg-(--primary-active) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Private Area Notice */}
        <p className="mt-4 text-center text-xs text-(--text-muted)">
          Private admin area
        </p>
      </div>
    </main>
  );
}
