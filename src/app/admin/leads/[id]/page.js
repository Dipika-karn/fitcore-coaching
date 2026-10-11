import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Archive,
  CalendarDays,
  Clock3,
  Dumbbell,
  Mail,
  MessageSquare,
  Phone,
  UserRound,
} from "lucide-react";

import LeadArchiveControl from "@/components/Admin/LeadArchiveControl";
import LeadStatusControl from "@/components/Admin/LeadStatusControl";
import { connectDB } from "@/lib/db";
import { getAdminSession } from "@/lib/getAdminSession";
import Lead from "@/models/Lead";

export const metadata = {
  title: "Lead Details | FitCore Coaching",
  robots: {
    index: false,
    follow: false,
  },
};

const statusStyles = {
  new: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  contacted:
    "border-amber-500/30 bg-amber-500/10 text-amber-400",
  "follow-up":
    "border-purple-500/30 bg-purple-500/10 text-purple-400",
  converted:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  closed:
    "border-gray-500/30 bg-gray-500/10 text-gray-400",
};

const statusLabels = {
  new: "New",
  contacted: "Contacted",
  "follow-up": "Follow-up",
  converted: "Converted",
  closed: "Closed",
};

const goalLabels = {
  "weight-loss": "Weight Loss",
  "muscle-gain": "Muscle Gain",
  strength: "Strength",
  "general-fitness": "General Fitness",
  other: "Other",
};

const planLabels = {
  starter: "Starter",
  transformation: "Transformation",
  premium: "Premium",
  "not-sure": "Not Sure Yet",
};

function formatDate(date) {
  if (!date) {
    return "Not available";
  }

  const formattedDate = new Date(date);

  if (Number.isNaN(formattedDate.getTime())) {
    return "Not available";
  }

  return formattedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DetailItem({ label, children }) {
  return (
    <div className="min-w-0">
      <p className="text-sm text-(--text)/60">
        {label}
      </p>

      <div className="mt-2 break-words text-sm font-medium text-(--text) sm:text-base">
        {children}
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-(--border) bg-(--card) p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-400">
          <Icon size={20} aria-hidden="true" />
        </div>

        <h2 className="text-lg font-semibold text-(--text)">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

export default async function LeadDetailsPage({
  params,
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;

  if (
    typeof id !== "string" ||
    !/^[a-fA-F0-9]{24}$/.test(id)
  ) {
    notFound();
  }

  await connectDB();

  const lead = await Lead.findById(id)
    .select(
      "name email phone goal plan status message isArchived createdAt updatedAt",
    )
    .lean();

  if (!lead) {
    notFound();
  }

  const status = lead.status || "new";

  const statusClass =
    statusStyles[status] || statusStyles.new;

  const statusLabel =
    statusLabels[status] || status;

  const isArchived = lead.isArchived === true;

  return (
    <main className="min-h-screen bg-(--background) p-4 text-(--text) sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* =====================================================
            Header
        ====================================================== */}

        <header className="space-y-5">
          <Link
            href="/admin/leads"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-(--text)/70 transition hover:bg-(--card) hover:text-(--text) focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          >
            <ArrowLeft
              size={17}
              aria-hidden="true"
            />

            Back to Leads
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-purple-400">
                FITCORE COACHING
              </p>

              <h1 className="mt-1 break-words text-2xl font-bold tracking-tight sm:text-3xl">
                {lead.name || "Unnamed Client"}
              </h1>

              <p className="mt-2 break-all text-sm text-(--text)/60">
                {lead.email || "No email provided"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${statusClass}`}
              >
                {statusLabel}
              </span>

              {isArchived && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-400">
                  <Archive
                    size={13}
                    aria-hidden="true"
                  />

                  Archived
                </span>
              )}
            </div>
          </div>
        </header>

        {/* =====================================================
            Contact Information
        ====================================================== */}

        <Section
          title="Contact Information"
          icon={UserRound}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <DetailItem label="Full Name">
              {lead.name || "Not provided"}
            </DetailItem>

            <DetailItem label="Email">
              {lead.email ? (
                <a
                  href={`mailto:${lead.email}`}
                  className="break-all text-purple-400 hover:underline"
                >
                  {lead.email}
                </a>
              ) : (
                "Not provided"
              )}
            </DetailItem>

            <DetailItem label="Phone">
              {lead.phone ? (
                <a
                  href={`tel:${lead.phone}`}
                  className="text-purple-400 hover:underline"
                >
                  {lead.phone}
                </a>
              ) : (
                "Not provided"
              )}
            </DetailItem>
          </div>
        </Section>

        {/* =====================================================
            Fitness Preferences
        ====================================================== */}

        <Section
          title="Fitness Preferences"
          icon={Dumbbell}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <DetailItem label="Fitness Goal">
              {goalLabels[lead.goal] ||
                lead.goal ||
                "Not provided"}
            </DetailItem>

            <DetailItem label="Selected Plan">
              {planLabels[lead.plan] ||
                lead.plan ||
                "Not provided"}
            </DetailItem>
          </div>
        </Section>

        {/* =====================================================
            Lead Status
        ====================================================== */}

        <Section
          title="Lead Status"
          icon={Activity}
        >
          <LeadStatusControl
            leadId={String(lead._id)}
            currentStatus={status}
          />
        </Section>

        {/* =====================================================
            Archive / Restore
        ====================================================== */}

        <Section
          title="Lead Management"
          icon={Archive}
        >
          <LeadArchiveControl
            leadId={String(lead._id)}
            isArchived={isArchived}
          />
        </Section>

        {/* =====================================================
            Client Message
        ====================================================== */}

        <Section
          title="Client Message"
          icon={MessageSquare}
        >
          {lead.message ? (
            <div className="rounded-xl border border-(--border) bg-(--background) p-4">
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-(--text)/80">
                {lead.message}
              </p>
            </div>
          ) : (
            <p className="text-sm text-(--text)/60">
              No message was provided by the client.
            </p>
          )}
        </Section>

        {/* =====================================================
            Submission Timeline
        ====================================================== */}

        <Section
          title="Submission Timeline"
          icon={CalendarDays}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <DetailItem label="Submitted">
              <span className="inline-flex items-center gap-2">
                <CalendarDays
                  size={16}
                  className="text-purple-400"
                  aria-hidden="true"
                />

                {formatDate(lead.createdAt)}
              </span>
            </DetailItem>

            <DetailItem label="Last Updated">
              <span className="inline-flex items-center gap-2">
                <Clock3
                  size={16}
                  className="text-purple-400"
                  aria-hidden="true"
                />

                {formatDate(lead.updatedAt)}
              </span>
            </DetailItem>
          </div>
        </Section>

        {/* =====================================================
            Quick Contact Actions
        ====================================================== */}

        <section className="rounded-2xl border border-(--border) bg-(--card) p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              >
                <Mail
                  size={17}
                  aria-hidden="true"
                />

                Email Client
              </a>
            )}

            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-(--border) px-4 py-3 text-sm font-semibold text-(--text) transition hover:border-purple-500/40 hover:bg-purple-500/5 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              >
                <Phone
                  size={17}
                  aria-hidden="true"
                />

                Call Client
              </a>
            )}
          </div>
        </section>

        {/* =====================================================
            Back Navigation
        ====================================================== */}

        <div className="pb-4">
          <Link
            href="/admin/leads"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-(--border) px-4 py-3 text-sm font-semibold text-(--text) transition hover:border-purple-500/40 hover:bg-purple-500/5 focus:outline-none focus:ring-2 focus:ring-purple-500/30 sm:w-auto"
          >
            <ArrowLeft
              size={17}
              aria-hidden="true"
            />

            Back to All Leads
          </Link>
        </div>
      </div>
    </main>
  );
}