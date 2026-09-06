import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRestaurant } from "@/lib/getCurrentRestaurant";

export async function POST(req: NextRequest) {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  let body: { name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
  }

  if (!body.name || !body.name.trim()) {
    return NextResponse.json({ error: "نام دسته الزامی است" }, { status: 400 });
  }

  try {
    const category = await prisma.category.create({
      data: { name: body.name.trim(), restaurantId: restaurant.id },
    });
    return NextResponse.json(category);
  } catch (err) {
    console.error("create category error:", err);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد. لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
