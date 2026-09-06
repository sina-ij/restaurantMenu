import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "./auth";
import { prisma } from "./prisma";

export async function getCurrentRestaurant() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: session.userId },
  });
  return restaurant;
}
