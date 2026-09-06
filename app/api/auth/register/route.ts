import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSession, COOKIE_NAME } from "@/lib/auth";
import { toApiError } from "@/lib/apiError";
import slugify from "slugify";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string; restaurantName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "اطلاعات ارسالی نامعتبر است" },
      { status: 400 }
    );
  }

  const { email, password, restaurantName } = body;

  if (!email || !password || !restaurantName?.trim()) {
    return NextResponse.json(
      { error: "ایمیل، رمز عبور و نام رستوران الزامی است" },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "فرمت ایمیل معتبر نیست" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "رمز عبور باید حداقل ۶ کاراکتر باشد" },
      { status: 400 }
    );
  }

  try {
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
            name: restaurantName.trim(),
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
  } catch (err) {
    console.error("register error:", err);
    const { message, status } = toApiError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
