import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/getAdminSession";
import LeadsDashboard from "@/components/Admin/LeadsDashboard";

export const metadata = {
  title: "Leads Dashboard | FitCore Coaching",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLeadsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <LeadsDashboard />;
}