import { getCurrentRestaurant } from "@/lib/getCurrentRestaurant";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { order: "asc" },
    include: { items: { orderBy: { order: "asc" } } },
  });

  return (
    <DashboardClient
      restaurant={{
        name: restaurant.name,
        slug: restaurant.slug,
        description: restaurant.description,
        logoUrl: restaurant.logoUrl,
        phone: restaurant.phone,
        address: restaurant.address,
        workingHours: restaurant.workingHours,
        locationUrl: restaurant.locationUrl,
      }}
      initialCategories={JSON.parse(JSON.stringify(categories))}
    />
  );
}
