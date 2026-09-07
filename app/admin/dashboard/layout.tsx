import { getCurrentSession, getCurrentRestaurant } from "@/lib/getCurrentRestaurant";
import { redirect } from "next/navigation";
import AdminChrome from "@/components/AdminChrome";
import RestaurantOnboarding from "@/components/RestaurantOnboarding";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/admin/login");
  if (session.role === "SUPER_ADMIN") redirect("/admin/super");

  const restaurant = await getCurrentRestaurant();

  return (
    <AdminChrome
      restaurant={
        restaurant
          ? { name: restaurant.name, slug: restaurant.slug, logoUrl: restaurant.logoUrl }
          : null
      }
    >
      {restaurant ? children : <RestaurantOnboarding />}
    </AdminChrome>
  );
}
