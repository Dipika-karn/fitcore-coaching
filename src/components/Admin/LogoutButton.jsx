
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogout() {
    setIsLoggingOut(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Logout failed.");
        return;
      }

      // Replace the current history entry with the login page.
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setErrorMessage("Unable to connect. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="inline-flex items-center gap-2 rounded-(--radius-md) border border-(--border) px-4 py-2 text-sm font-medium text-(--text-secondary) transition hover:bg-(--card-hover) disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut size={16} />
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>

      {errorMessage && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}