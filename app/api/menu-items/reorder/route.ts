import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRestaurant } from "@/lib/getCurrentRestaurant";
import { toApiError } from "@/lib/apiError";

export async function PUT(req: NextRequest) {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  let body: { categoryId?: string; ids?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
  }

  const { categoryId, ids } = body;
  if (!categoryId || !Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category || category.restaurantId !== restaurant.id) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  const items = await prisma.menuItem.findMany({ where: { categoryId }, select: { id: true } });
  const existingIds = new Set(items.map((i) => i.id));
  if (ids.length !== existingIds.size || ids.some((id) => !existingIds.has(id))) {
    return NextResponse.json({ error: "لیست آیتم‌ها نامعتبر است" }, { status: 400 });
  }

  try {
    await prisma.$transaction(
      ids.map((id, index) => prisma.menuItem.update({ where: { id }, data: { order: index } }))
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reorder menu items error:", err);
    const { message, status } = toApiError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
