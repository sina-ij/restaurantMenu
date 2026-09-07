import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRestaurant } from "@/lib/getCurrentRestaurant";
import { toApiError } from "@/lib/apiError";

export async function PUT(req: NextRequest) {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  let body: { ids?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
  }

  const ids = body.ids;
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
  }

  const categories = await prisma.category.findMany({
    where: { restaurantId: restaurant.id },
    select: { id: true },
  });
  const existingIds = new Set(categories.map((c) => c.id));
  if (ids.length !== existingIds.size || ids.some((id) => !existingIds.has(id))) {
    return NextResponse.json({ error: "لیست دسته‌ها نامعتبر است" }, { status: 400 });
  }

  try {
    await prisma.$transaction(
      ids.map((id, index) => prisma.category.update({ where: { id }, data: { order: index } }))
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reorder categories error:", err);
    const { message, status } = toApiError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
