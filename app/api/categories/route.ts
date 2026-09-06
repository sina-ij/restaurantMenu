import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRestaurant } from "@/lib/getCurrentRestaurant";

export async function POST(req: NextRequest) {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name || !name.trim()) {
    return NextResponse.json({ error: "نام دسته الزامی است" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: { name: name.trim(), restaurantId: restaurant.id },
  });

  return NextResponse.json(category);
}
