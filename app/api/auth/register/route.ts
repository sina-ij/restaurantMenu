import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSession, COOKIE_NAME } from "@/lib/auth";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  const { email, password, restaurantName } = await req.json();

  if (!email || !password || !restaurantName) {
    return NextResponse.json(
      { error: "ایمیل، رمز عبور و نام رستوران الزامی است" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "این ایمیل قبلاً ثبت‌نام کرده است" },
      { status: 409 }
    );
  }

  let baseSlug = slugify(restaurantName, { lower: true, strict: true });
  if (!baseSlug) baseSlug = "cafe";
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.restaurant.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      restaurant: {
        create: {
          name: restaurantName,
          slug,
        },
      },
    },
    include: { restaurant: true },
  });

  const token = await signSession({
    userId: user.id,
    restaurantId: user.restaurant?.id,
  });

  const res = NextResponse.json({ slug: user.restaurant?.slug });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
