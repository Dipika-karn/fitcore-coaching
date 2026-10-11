"use client";

import { useState } from "react";
import { Check, LoaderCircle } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "follow-up", label: "Follow-up" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
];

const STATUS_STYLES = {
  new: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  contacted: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  "follow-up": "bg-purple-500/10 text-purple-400 ring-purple-500/20",
  converted: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  closed: "bg-red-500/10 text-red-400 ring-red-500/20",
};

function formatStatus(status) {
  const option = STATUS_OPTIONS.find((item) => item.value === status);

  return option ? option.label : status;
}

export default function LeadStatusControl({ leadId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [savedStatus, setSavedStatus] = useState(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const hasChanges = status !== savedStatus;

  async function handleSave() {
    if (!hasChanges || isSaving) {
      return;
    }

    setIsSaving(true);
    setFeedback({
      type: "",
      message: "",
    });

    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update lead status.");
      }

      setSavedStatus(data.lead.status);

      setFeedback({
        type: "success",
        message: "Lead status updated successfully.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update lead status.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const statusStyle =
    STATUS_STYLES[savedStatus] || "bg-slate-500/10 text-slate-400 ring-slate-500/20";

  return (
    <div className="space-y-5">
      {/* Current Status */}
      <div>
        <p className="mb-2 text-sm font-medium text-(--text)">
          Current Status
        </p>

        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${statusStyle}`}
        >
          {formatStatus(savedStatus)}
        </span>
      </div>

      {/* Status Selector */}
      <div className="space-y-2">
        <label
          htmlFor="lead-status"
          className="block text-sm font-medium text-(--text)"
        >
          Update Status
        </label>

        <select
          id="lead-status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);

            setFeedback({
              type: "",
              message: "",
            });
          }}
          disabled={isSaving}
          className="w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 text-sm text-(--text) outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={!hasChanges || isSaving}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {isSaving ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Check className="h-4 w-4" />
            {hasChanges ? "Update Status" : "Status Saved"}
          </>
        )}
      </button>

      {/* Feedback */}
      <div
        aria-live="polite"
        className="min-h-5 text-sm"
      >
        {feedback.message && (
          <p
            className={
              feedback.type === "success"
                ? "text-emerald-400"
                : "text-red-400"
            }
          >
            {feedback.message}
          </p>
        )}
      </div>
    </div>
  );
}