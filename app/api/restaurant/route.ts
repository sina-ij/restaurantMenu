import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRestaurant } from "@/lib/getCurrentRestaurant";
import { toApiError } from "@/lib/apiError";

export async function PUT(req: NextRequest) {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  let body: {
    name?: string;
    description?: string;
    phone?: string;
    address?: string;
    workingHours?: string;
    locationUrl?: string;
    logoUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
  }

  if (body.name !== undefined && !body.name.trim()) {
    return NextResponse.json({ error: "نام رستوران/کافه الزامی است" }, { status: 400 });
  }

  try {
    const updated = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        name: body.name?.trim() ?? restaurant.name,
        description: body.description?.trim() || null,
        phone: body.phone?.trim() || null,
        address: body.address?.trim() || null,
        workingHours: body.workingHours?.trim() || null,
        locationUrl: body.locationUrl?.trim() || null,
        logoUrl: body.logoUrl !== undefined ? body.logoUrl || null : restaurant.logoUrl,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("update restaurant error:", err);
    const { message, status } = toApiError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
