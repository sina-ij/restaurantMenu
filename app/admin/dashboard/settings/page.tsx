import { getCurrentRestaurant } from "@/lib/getCurrentRestaurant";
import { redirect } from "next/navigation";
import RestaurantSettings from "@/components/RestaurantSettings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) redirect("/admin/login");

  return (
    <RestaurantSettings
      restaurant={{
        name: restaurant.name,
        slug: restaurant.slug,
        description: restaurant.description,
        logoUrl: restaurant.logoUrl,
        phone: restaurant.phone,
        address: restaurant.address,
        workingHours: restaurant.workingHours,
        locationUrl: restaurant.locationUrl,
        instagram: restaurant.instagram,
        businessType: restaurant.businessType,
        accentColor: restaurant.accentColor,
        pattern: restaurant.pattern,
      }}
    />
  );
}
