import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRestaurant } from "@/lib/getCurrentRestaurant";

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

  const body = await req.json();
  const updated = await prisma.menuItem.update({
    where: { id: params.id },
    data: {
      name: body.name ?? existing.name,
      description: body.description ?? existing.description,
      price: body.price !== undefined ? parseInt(body.price, 10) : existing.price,
      imageUrl: body.imageUrl ?? existing.imageUrl,
      available: body.available ?? existing.available,
    },
  });

  return NextResponse.json(updated);
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

  await prisma.menuItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
