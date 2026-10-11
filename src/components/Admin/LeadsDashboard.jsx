"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  Dumbbell,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";

import LogoutButton from "@/components/Admin/LogoutButton";

const statusStyles = {
  new: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  contacted: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  "follow-up":
    "bg-purple-500/10 text-purple-400 ring-purple-500/20",
  converted:
    "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  closed: "bg-red-500/10 text-red-400 ring-red-500/20",
};

const archiveStyles =
  "bg-orange-500/10 text-orange-400 ring-orange-500/20";

function formatLabel(value) {
  if (!value) {
    return "—";
  }

  return value
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function StatusBadge({ status }) {
  const normalizedStatus = statusStyles[status]
    ? status
    : "new";

  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        statusStyles[normalizedStatus]
      }`}
    >
      <span className="truncate">
        {formatLabel(status || "new")}
      </span>
    </span>
  );
}

function ArchiveBadge() {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${archiveStyles}`}
    >
      <Archive
        size={12}
        aria-hidden="true"
        className="shrink-0"
      />

      <span className="truncate">Archived</span>
    </span>
  );
}

export default function LeadsDashboard() {
  const router = useRouter();

  /*
   * ============================================================
   * Leads State
   * ============================================================
   */

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  /*
   * ============================================================
   * Search & Filter State
   * ============================================================
   */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [goalFilter, setGoalFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const [archiveFilter, setArchiveFilter] =
    useState("active");

  /*
   * ============================================================
   * Client-Side Filtering
   * ============================================================
   */

  const normalizedSearch = search.trim().toLowerCase();

  const filteredLeads = leads.filter((lead) => {
    /*
     * Archive
     *
     * Missing isArchived means active for legacy leads.
     */
    const isArchived = lead.isArchived === true;

    const matchesArchive =
      archiveFilter === "all" ||
      (archiveFilter === "active" && !isArchived) ||
      (archiveFilter === "archived" && isArchived);

    /*
     * Search
     */
    const matchesSearch =
      normalizedSearch === "" ||
      String(lead.name ?? "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      String(lead.email ?? "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      String(lead.phone ?? "")
        .toLowerCase()
        .includes(normalizedSearch);

    /*
     * Status
     */
    const matchesStatus =
      statusFilter === "all" ||
      lead.status === statusFilter;

    /*
     * Goal
     */
    const matchesGoal =
      goalFilter === "all" ||
      lead.goal === goalFilter;

    /*
     * Plan
     */
    const matchesPlan =
      planFilter === "all" ||
      lead.plan === planFilter;

    return (
      matchesArchive &&
      matchesSearch &&
      matchesStatus &&
      matchesGoal &&
      matchesPlan
    );
  });

  /*
   * ============================================================
   * Clear Filters
   * ============================================================
   */

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    goalFilter !== "all" ||
    planFilter !== "all" ||
    archiveFilter !== "active";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setGoalFilter("all");
    setPlanFilter("all");
    setArchiveFilter("active");
  }

  /*
   * ============================================================
   * Fetch Leads
   * ============================================================
   */

  const fetchLeads = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "/api/admin/leads?archived=all&limit=50",
          {
            method: "GET",
            signal,
            cache: "no-store",
          },
        );

        if (response.status === 401) {
          router.replace("/admin/login");
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load leads. Please try again.",
          );
        }

        if (!Array.isArray(data.leads)) {
          throw new Error(
            "The server returned an invalid leads response.",
          );
        }

        setLeads(data.leads);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        setError(
          err.message ||
            "Something went wrong while loading leads.",
        );
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [router],
  );

  /*
   * ============================================================
   * Initial Fetch / Refresh
   * ============================================================
   */

  useEffect(() => {
    const controller = new AbortController();

    fetchLeads(controller.signal);

    return () => controller.abort();
  }, [fetchLeads, retryCount]);

  /*
   * ============================================================
   * Summary Statistics
   * ============================================================
   */

  const activeLeads = leads.filter(
    (lead) => lead.isArchived !== true,
  );

  const archivedLeads = leads.filter(
    (lead) => lead.isArchived === true,
  );

  const newLeads = activeLeads.filter(
    (lead) => lead.status === "new",
  ).length;

  return (
    <main className="min-h-screen bg-(--background) p-4 text-(--text) sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* =====================================================
            Dashboard Header
        ====================================================== */}

        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-purple-400">
              FITCORE COACHING
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm opacity-70">
              Manage your coaching enquiries in one place.
            </p>
          </div>

          <LogoutButton />
        </header>

        {/* =====================================================
            Summary Cards
        ====================================================== */}

        <section
          aria-label="Lead summary"
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <SummaryCard
            title="Active Leads"
            value={activeLeads.length}
            icon={<Users size={20} />}
          />

          <SummaryCard
            title="New Leads"
            value={newLeads}
            icon={<Dumbbell size={20} />}
          />

          <SummaryCard
            title="Archived"
            value={archivedLeads.length}
            icon={<Archive size={20} />}
          />
        </section>

        {/* =====================================================
            Search & Filters
        ====================================================== */}

        <section className="rounded-2xl border border-(--border) bg-(--card) p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-(--text) sm:text-lg">
              Search & Filters
            </h2>

            <p className="mt-1 text-sm text-(--text)/60">
              Find leads by name, email, phone, status,
              goal, plan, or archive state.
            </p>
          </div>

          <div className="space-y-4">
            {/* Search */}

            <div className="relative">
              <label
                htmlFor="lead-search"
                className="sr-only"
              >
                Search leads
              </label>

              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text)/50"
              />

              <input
                id="lead-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search name, email, or phone..."
                maxLength={100}
                className="min-h-11 w-full rounded-xl border border-(--border) bg-(--background) py-2.5 pl-10 pr-4 text-sm text-(--text) outline-none transition placeholder:text-(--text)/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Filters */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {/* Archive */}

              <div>
                <label
                  htmlFor="archive-filter"
                  className="mb-1.5 block text-sm font-medium text-(--text)/70"
                >
                  Lead View
                </label>

                <select
                  id="archive-filter"
                  value={archiveFilter}
                  onChange={(event) =>
                    setArchiveFilter(event.target.value)
                  }
                  className="min-h-11 w-full rounded-xl border border-(--border) bg-(--background) px-3.5 py-2.5 text-sm text-(--text) outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="active">
                    Active Leads
                  </option>

                  <option value="archived">
                    Archived Leads
                  </option>

                  <option value="all">
                    All Leads
                  </option>
                </select>
              </div>

              {/* Status */}

              <div>
                <label
                  htmlFor="status-filter"
                  className="mb-1.5 block text-sm font-medium text-(--text)/70"
                >
                  Status
                </label>

                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="min-h-11 w-full rounded-xl border border-(--border) bg-(--background) px-3.5 py-2.5 text-sm text-(--text) outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="all">
                    All Statuses
                  </option>

                  <option value="new">New</option>

                  <option value="contacted">
                    Contacted
                  </option>

                  <option value="follow-up">
                    Follow-up
                  </option>

                  <option value="converted">
                    Converted
                  </option>

                  <option value="closed">
                    Closed
                  </option>
                </select>
              </div>

              {/* Goal */}

              <div>
                <label
                  htmlFor="goal-filter"
                  className="mb-1.5 block text-sm font-medium text-(--text)/70"
                >
                  Goal
                </label>

                <select
                  id="goal-filter"
                  value={goalFilter}
                  onChange={(event) =>
                    setGoalFilter(event.target.value)
                  }
                  className="min-h-11 w-full rounded-xl border border-(--border) bg-(--background) px-3.5 py-2.5 text-sm text-(--text) outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="all">
                    All Goals
                  </option>

                  <option value="weight-loss">
                    Weight Loss
                  </option>

                  <option value="muscle-gain">
                    Muscle Gain
                  </option>

                  <option value="strength">
                    Strength
                  </option>

                  <option value="general-fitness">
                    General Fitness
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              {/* Plan */}

              <div>
                <label
                  htmlFor="plan-filter"
                  className="mb-1.5 block text-sm font-medium text-(--text)/70"
                >
                  Plan
                </label>

                <select
                  id="plan-filter"
                  value={planFilter}
                  onChange={(event) =>
                    setPlanFilter(event.target.value)
                  }
                  className="min-h-11 w-full rounded-xl border border-(--border) bg-(--background) px-3.5 py-2.5 text-sm text-(--text) outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="all">
                    All Plans
                  </option>

                  <option value="starter">
                    Starter
                  </option>

                  <option value="transformation">
                    Transformation
                  </option>

                  <option value="premium">
                    Premium
                  </option>

                  <option value="not-sure">
                    Not Sure Yet
                  </option>
                </select>
              </div>

              {/* Clear Filters */}

              <div className="flex items-end">
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-(--border) px-4 py-2.5 text-sm font-medium text-(--text) transition hover:border-purple-500/40 hover:bg-purple-500/5 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <X
                      size={16}
                      aria-hidden="true"
                    />

                    Clear Filters
                  </button>
                ) : (
                  <div className="min-h-11 w-full" />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            Leads
        ====================================================== */}

        <section className="overflow-hidden rounded-2xl border border-(--border) bg-(--card)">
          {/* Header */}

          <div className="flex flex-col gap-3 border-b border-(--border) p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-semibold">
                {archiveFilter === "active"
                  ? "Active Leads"
                  : archiveFilter === "archived"
                    ? "Archived Leads"
                    : "All Leads"}
              </h2>

              <p className="mt-1 text-sm opacity-60">
                Coaching enquiries submitted through your
                website.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setRetryCount((count) => count + 1)
              }
              disabled={loading}
              className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg border border-(--border) px-3 py-2 text-sm font-medium transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw
                size={16}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>
          </div>

          {/* ===================================================
              Loading
          ==================================================== */}

          {loading && (
            <div
              className="flex min-h-56 flex-col items-center justify-center gap-3 p-6"
              role="status"
              aria-live="polite"
            >
              <RefreshCw
                size={28}
                className="animate-spin text-purple-400"
              />

              <p className="text-sm opacity-70">
                Loading leads...
              </p>
            </div>
          )}

          {/* ===================================================
              Error
          ==================================================== */}

          {!loading && error && (
            <div
              className="flex min-h-56 flex-col items-center justify-center gap-3 p-6 text-center"
              role="alert"
            >
              <p className="font-medium">
                Could not load leads
              </p>

              <p className="max-w-md text-sm opacity-70">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  setRetryCount((count) => count + 1)
                }
                className="mt-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-500"
              >
                Try again
              </button>
            </div>
          )}

          {/* ===================================================
              No Leads
          ==================================================== */}

          {!loading &&
            !error &&
            leads.length === 0 && (
              <div className="flex min-h-56 flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="rounded-full bg-purple-500/10 p-4 text-purple-400">
                  <Users size={28} />
                </div>

                <h3 className="font-semibold">
                  No leads yet
                </h3>

                <p className="max-w-sm text-sm opacity-70">
                  New coaching enquiries will appear here
                  when someone submits your website contact
                  form.
                </p>
              </div>
            )}

          {/* ===================================================
              No Filter Results
          ==================================================== */}

          {!loading &&
            !error &&
            leads.length > 0 &&
            filteredLeads.length === 0 && (
              <div className="flex min-h-56 flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="rounded-full bg-purple-500/10 p-4 text-purple-400">
                  {archiveFilter === "archived" ? (
                    <Archive size={28} />
                  ) : (
                    <Search size={28} />
                  )}
                </div>

                <h3 className="font-semibold">
                  {archiveFilter === "archived"
                    ? "No archived leads"
                    : "No leads found"}
                </h3>

                <p className="max-w-sm text-sm opacity-70">
                  {archiveFilter === "archived"
                    ? "Archived leads will appear here when you archive an enquiry."
                    : "Try changing your search or filters."}
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-1 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  >
                    <X
                      size={16}
                      aria-hidden="true"
                    />

                    Clear Filters
                  </button>
                )}
              </div>
            )}

          {/* ===================================================
              DESKTOP TABLE
              lg and above
          ==================================================== */}

          {!loading &&
            !error &&
            leads.length > 0 &&
            filteredLeads.length > 0 && (
              <>
                <div className="hidden lg:block">
                  <table className="w-full table-fixed text-left text-sm">
                    {/* Column widths */}

                    <colgroup>
                      <col className="w-[23%]" />
                      <col className="w-[12%]" />
                      <col className="w-[14%]" />
                      <col className="w-[14%]" />
                      <col className="w-[13%]" />
                      <col className="w-[12%]" />
                      <col className="w-[12%]" />
                    </colgroup>

                    <thead className="bg-(--background) text-xs uppercase tracking-wide opacity-70">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-4 font-medium"
                        >
                          Name / Email
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-4 font-medium"
                        >
                          Phone
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-4 font-medium"
                        >
                          Fitness Goal
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-4 font-medium"
                        >
                          Plan
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-4 font-medium"
                        >
                          Status
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-4 font-medium"
                        >
                          Submitted
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-4 font-medium"
                        >
                          State
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-(--border)">
                      {filteredLeads.map((lead) => (
                        <tr
                          key={lead._id}
                          onClick={() =>
                            router.push(
                              `/admin/leads/${lead._id}`,
                            )
                          }
                          onKeyDown={(event) => {
                            if (
                              event.target !==
                              event.currentTarget
                            ) {
                              return;
                            }

                            if (
                              event.key === "Enter" ||
                              event.key === " "
                            ) {
                              event.preventDefault();

                              router.push(
                                `/admin/leads/${lead._id}`,
                              );
                            }
                          }}
                          tabIndex={0}
                          aria-label={`View details for ${
                            lead.name ||
                            "Unnamed Client"
                          }`}
                          className="cursor-pointer transition hover:bg-purple-500/5 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-purple-500"
                        >
                          {/* Name / Email */}

                          <td className="min-w-0 px-4 py-4 align-top">
                            <Link
                              href={`/admin/leads/${lead._id}`}
                              onClick={(event) =>
                                event.stopPropagation()
                              }
                              className="block truncate font-medium text-(--text) transition hover:text-purple-400 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                            >
                              {lead.name ||
                                "Unnamed Client"}
                            </Link>

                            {lead.email ? (
                              <a
                                href={`mailto:${lead.email}`}
                                onClick={(event) =>
                                  event.stopPropagation()
                                }
                                className="mt-1 block break-words text-xs leading-5 text-purple-400 hover:underline"
                              >
                                {lead.email}
                              </a>
                            ) : (
                              <p className="mt-1 text-xs opacity-60">
                                No email
                              </p>
                            )}
                          </td>

                          {/* Phone */}

                          <td className="min-w-0 px-4 py-4 align-top">
                            {lead.phone ? (
                              <a
                                href={`tel:${lead.phone}`}
                                onClick={(event) =>
                                  event.stopPropagation()
                                }
                                className="block break-words text-sm hover:text-purple-400"
                              >
                                {lead.phone}
                              </a>
                            ) : (
                              <span className="opacity-60">
                                —
                              </span>
                            )}
                          </td>

                          {/* Goal */}

                          <td className="min-w-0 px-4 py-4 align-top">
                            <span className="block break-words leading-5">
                              {formatLabel(lead.goal)}
                            </span>
                          </td>

                          {/* Plan */}

                          <td className="min-w-0 px-4 py-4 align-top">
                            <span className="block break-words leading-5">
                              {formatLabel(lead.plan)}
                            </span>
                          </td>

                          {/* Status */}

                          <td className="min-w-0 px-4 py-4 align-top">
                            <StatusBadge
                              status={lead.status}
                            />
                          </td>

                          {/* Submitted */}

                          <td className="min-w-0 px-4 py-4 align-top">
                            <span className="block break-words text-xs leading-5 opacity-70">
                              {formatDate(
                                lead.createdAt,
                              )}
                            </span>
                          </td>

                          {/* Archive State */}

                          <td className="min-w-0 px-4 py-4 align-top">
                            {lead.isArchived === true ? (
                              <ArchiveBadge />
                            ) : (
                              <span className="text-xs font-medium text-emerald-400">
                                Active
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* =================================================
                    MOBILE / TABLET LEAD CARDS
                    Below lg
                ================================================== */}

                <div className="divide-y divide-(--border) lg:hidden">
                  {filteredLeads.map((lead) => {
                    const isArchived =
                      lead.isArchived === true;

                    return (
                      <Link
                        key={lead._id}
                        href={`/admin/leads/${lead._id}`}
                        className="block p-5 transition hover:bg-purple-500/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                      >
                        {/* Lead Header */}

                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-(--text)">
                              {lead.name ||
                                "Unnamed Client"}
                            </h3>

                            <p className="mt-1 truncate text-xs text-(--text)/50">
                              {lead.email || "No email"}
                            </p>
                          </div>

                          <div className="shrink-0">
                            {isArchived ? (
                              <ArchiveBadge />
                            ) : (
                              <span className="whitespace-nowrap text-xs font-medium text-emerald-400">
                                Active
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Lead Information */}

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="min-w-0">
                            <p className="text-xs text-(--text)/50">
                              Phone
                            </p>

                            <p className="mt-1 truncate text-sm">
                              {lead.phone || "—"}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-(--text)/50">
                              Goal
                            </p>

                            <p className="mt-1 truncate text-sm">
                              {formatLabel(lead.goal)}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-(--text)/50">
                              Plan
                            </p>

                            <p className="mt-1 truncate text-sm">
                              {formatLabel(lead.plan)}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-(--text)/50">
                              Status
                            </p>

                            <div className="mt-1">
                              <StatusBadge
                                status={lead.status}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Lead Footer */}

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-(--border) pt-3">
                          <span className="truncate text-xs text-(--text)/50">
                            Submitted{" "}
                            {formatDate(
                              lead.createdAt,
                            )}
                          </span>

                          <span className="whitespace-nowrap text-xs font-semibold text-purple-400">
                            View Details →
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

          {/* ===================================================
              Result Count
          ==================================================== */}

          {!loading &&
            !error &&
            leads.length > 0 && (
              <div className="border-t border-(--border) px-5 py-3 text-xs opacity-60">
                Showing{" "}
                <span className="font-semibold opacity-100">
                  {filteredLeads.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold opacity-100">
                  {leads.length}
                </span>{" "}
                {leads.length === 1
                  ? "lead"
                  : "leads"}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}

/*
 * ============================================================
 * Summary Card
 * ============================================================
 */

function SummaryCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-(--border) bg-(--card) p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm opacity-70">
          {title}
        </p>

        <span className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold tabular-nums">
        {value}
      </p>
    </div>
  );
}