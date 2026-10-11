"use client";

import { useState } from "react";
import { Archive, ArchiveRestore, LoaderCircle } from "lucide-react";

export default function LeadArchiveControl({
  leadId,
  isArchived,
}) {
  const [archived, setArchived] = useState(
    isArchived === true,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  async function handleArchiveChange(nextValue) {
    if (isSaving || nextValue === archived) {
      return;
    }

    const action = nextValue ? "archive" : "restore";

    if (
      nextValue &&
      !window.confirm(
        "Are you sure you want to archive this lead?",
      )
    ) {
      return;
    }

    setIsSaving(true);
    setFeedback({
      type: "",
      message: "",
    });

    try {
      const response = await fetch(
        `/api/admin/leads/${leadId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isArchived: nextValue,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            `Unable to ${action} this lead.`,
        );
      }

      setArchived(data.lead.isArchived === true);

      setFeedback({
        type: "success",
        message: nextValue
          ? "Lead archived successfully."
          : "Lead restored successfully.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : `Unable to ${action} this lead.`,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-(--text)">
            Lead State
          </p>

          <p className="mt-1 text-sm text-(--text)/60">
            {archived
              ? "This lead is currently archived."
              : "This lead is currently active."}
          </p>
        </div>

        {archived ? (
          <button
            type="button"
            onClick={() => handleArchiveChange(false)}
            disabled={isSaving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : (
              <ArchiveRestore
                size={17}
                aria-hidden="true"
              />
            )}

            {isSaving ? "Restoring..." : "Restore Lead"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleArchiveChange(true)}
            disabled={isSaving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : (
              <Archive
                size={17}
                aria-hidden="true"
              />
            )}

            {isSaving ? "Archiving..." : "Archive Lead"}
          </button>
        )}
      </div>

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