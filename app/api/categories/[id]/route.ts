import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRestaurant } from "@/lib/getCurrentRestaurant";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  const category = await prisma.category.findUnique({ where: { id: params.id } });
  if (!category || category.restaurantId !== restaurant.id) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  const { name } = await req.json();
  const updated = await prisma.category.update({
    where: { id: params.id },
    data: { name },
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

  const category = await prisma.category.findUnique({ where: { id: params.id } });
  if (!category || category.restaurantId !== restaurant.id) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
