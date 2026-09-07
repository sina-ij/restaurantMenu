import { getCurrentSession } from "@/lib/getCurrentRestaurant";
import { redirect } from "next/navigation";
import SuperAdminHeader from "@/components/SuperAdminHeader";
import { BackgroundPattern } from "@/components/BackgroundPattern";

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
    <div className="relative min-h-screen bg-paper">
      <BackgroundPattern opacity={0.35} />
      <SuperAdminHeader />
      {children}
    </div>
  );
}
