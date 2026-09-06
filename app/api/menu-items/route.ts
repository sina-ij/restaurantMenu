import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRestaurant } from "@/lib/getCurrentRestaurant";

export async function POST(req: NextRequest) {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  let body: {
    name?: string;
    description?: string;
    price?: string | number;
    imageUrl?: string;
    categoryId?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
  }

  const { name, description, price, imageUrl, categoryId } = body;

  if (!name?.trim() || !price || !categoryId) {
    return NextResponse.json(
      { error: "نام، قیمت و دسته‌بندی الزامی است" },
      { status: 400 }
    );
  }

  const priceNumber = typeof price === "number" ? price : parseInt(price, 10);
  if (!Number.isFinite(priceNumber) || priceNumber < 0) {
    return NextResponse.json({ error: "قیمت باید یک عدد معتبر باشد" }, { status: 400 });
  }

  try {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category || category.restaurantId !== restaurant.id) {
      return NextResponse.json({ error: "دسته‌بندی نامعتبر است" }, { status: 400 });
    }

    const item = await prisma.menuItem.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price: priceNumber,
        imageUrl: imageUrl || null,
        categoryId,
      },
    });

    return NextResponse.json(item);
  } catch (err) {
    console.error("create menu item error:", err);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد. لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
