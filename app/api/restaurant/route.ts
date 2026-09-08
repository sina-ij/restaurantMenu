import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRestaurant, getCurrentUserId } from "@/lib/getCurrentRestaurant";
import { toApiError } from "@/lib/apiError";

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  const existingRestaurant = await prisma.restaurant.findUnique({ where: { ownerId: userId } });
  if (existingRestaurant) {
    return NextResponse.json({ error: "شما قبلاً یک رستوران/کافه ساخته‌اید" }, { status: 409 });
  }

  let body: { name?: string; slug?: string; businessType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
  }

  const name = body.name?.trim();
  const slug = body.slug?.trim().toLowerCase();

  if (!name) {
    return NextResponse.json({ error: "نام رستوران/کافه الزامی است" }, { status: 400 });
  }
  if (!slug) {
    return NextResponse.json({ error: "آدرس انگلیسی منو الزامی است" }, { status: 400 });
  }
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json(
      { error: "آدرس منو فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد" },
      { status: 400 }
    );
  }

  try {
    const slugTaken = await prisma.restaurant.findUnique({ where: { slug } });
    if (slugTaken) {
      return NextResponse.json(
        { error: "این آدرس قبلاً استفاده شده، یک آدرس دیگر انتخاب کنید" },
        { status: 409 }
      );
    }

    const restaurant = await prisma.restaurant.create({
      data: { name, slug, businessType: body.businessType?.trim() || null, ownerId: userId },
    });
    return NextResponse.json(restaurant);
  } catch (err) {
    console.error("create restaurant error:", err);
    const { message, status } = toApiError(err);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(req: NextRequest) {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  let body: {
    name?: string;
    slug?: string;
    description?: string;
    phone?: string;
    address?: string;
    workingHours?: string;
    locationUrl?: string;
    logoUrl?: string;
    businessType?: string;
    accentColor?: string;
    instagram?: string;
    pattern?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
  }

  if (body.name !== undefined && !body.name.trim()) {
    return NextResponse.json({ error: "نام رستوران/کافه الزامی است" }, { status: 400 });
  }
  if (body.accentColor !== undefined && !HEX_RE.test(body.accentColor)) {
    return NextResponse.json({ error: "رنگ انتخابی معتبر نیست" }, { status: 400 });
  }

  let slug = restaurant.slug;
  if (body.slug !== undefined) {
    const trimmedSlug = body.slug.trim().toLowerCase();
    if (!trimmedSlug) {
      return NextResponse.json({ error: "آدرس منو الزامی است" }, { status: 400 });
    }
    if (!SLUG_RE.test(trimmedSlug)) {
      return NextResponse.json(
        { error: "آدرس منو فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد" },
        { status: 400 }
      );
    }
    if (trimmedSlug !== restaurant.slug) {
      const slugTaken = await prisma.restaurant.findUnique({ where: { slug: trimmedSlug } });
      if (slugTaken) {
        return NextResponse.json(
          { error: "این آدرس قبلاً استفاده شده، یک آدرس دیگر انتخاب کنید" },
          { status: 409 }
        );
      }
    }
    slug = trimmedSlug;
  }

  try {
    const updated = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        name: body.name?.trim() ?? restaurant.name,
        slug,
        description: body.description?.trim() || null,
        phone: body.phone?.trim() || null,
        address: body.address?.trim() || null,
        workingHours: body.workingHours?.trim() || null,
        locationUrl: body.locationUrl?.trim() || null,
        logoUrl: body.logoUrl !== undefined ? body.logoUrl || null : restaurant.logoUrl,
        businessType: body.businessType?.trim() || null,
        accentColor: body.accentColor ?? restaurant.accentColor,
        instagram: body.instagram?.trim() || null,
        pattern: body.pattern?.trim() || null,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("update restaurant error:", err);
    const { message, status } = toApiError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
