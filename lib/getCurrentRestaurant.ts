import { cache } from "react";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "./auth";
import { prisma } from "./prisma";

export const getCurrentUserId = cache(async () => {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySession(token);
  return session?.userId ?? null;
});

export const getCurrentRestaurant = cache(async () => {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: userId },
  });
  return restaurant;
});
