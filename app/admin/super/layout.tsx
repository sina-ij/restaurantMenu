import { getCurrentSession } from "@/lib/getCurrentRestaurant";
import { redirect } from "next/navigation";
import SuperAdminHeader from "@/components/SuperAdminHeader";

export const dynamic = "force-dynamic";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "SUPER_ADMIN") redirect("/admin/dashboard");

  return (
    <div className="min-h-screen bg-paper">
      <SuperAdminHeader />
      {children}
    </div>
  );
}
