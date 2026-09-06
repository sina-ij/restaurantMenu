import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRestaurant } from "@/lib/getCurrentRestaurant";

export async function POST(req: NextRequest) {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  const { name, description, price, imageUrl, categoryId } = await req.json();

  if (!name || !price || !categoryId) {
    return NextResponse.json(
      { error: "نام، قیمت و دسته‌بندی الزامی است" },
      { status: 400 }
    );
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category || category.restaurantId !== restaurant.id) {
    return NextResponse.json({ error: "دسته‌بندی نامعتبر است" }, { status: 400 });
  }

  const item = await prisma.menuItem.create({
    data: {
      name,
      description,
      price: parseInt(price, 10),
      imageUrl,
      categoryId,
    },
  });

  return NextResponse.json(item);
}
