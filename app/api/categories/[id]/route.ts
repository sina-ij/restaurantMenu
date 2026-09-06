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
    const updated = await prisma.category.update({
      where: { id: params.id },
      data: { name: body.name.trim() },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("update category error:", err);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد. لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
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

  const category = await prisma.category.findUnique({ where: { id: params.id } });
  if (!category || category.restaurantId !== restaurant.id) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  try {
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("delete category error:", err);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد. لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
