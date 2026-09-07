import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRestaurant } from "@/lib/getCurrentRestaurant";
import { toApiError } from "@/lib/apiError";

async function assertOwnership(itemId: string, restaurantId: string) {
  const item = await prisma.menuItem.findUnique({
    where: { id: itemId },
    include: { category: true },
  });
  if (!item || item.category.restaurantId !== restaurantId) return null;
  return item;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  const existing = await assertOwnership(params.id, restaurant.id);
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  let body: {
    name?: string;
    description?: string;
    price?: string | number;
    imageUrl?: string;
    available?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
  }

  let price = existing.price;
  if (body.price !== undefined) {
    const parsed = typeof body.price === "number" ? body.price : parseInt(body.price, 10);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return NextResponse.json({ error: "قیمت باید یک عدد معتبر باشد" }, { status: 400 });
    }
    price = parsed;
  }

  try {
    const updated = await prisma.menuItem.update({
      where: { id: params.id },
      data: {
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        price,
        imageUrl: body.imageUrl ?? existing.imageUrl,
        available: body.available ?? existing.available,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("update menu item error:", err);
    const { message, status } = toApiError(err);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  const existing = await assertOwnership(params.id, restaurant.id);
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  try {
    await prisma.menuItem.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("delete menu item error:", err);
    const { message, status } = toApiError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
