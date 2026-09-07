import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/getCurrentRestaurant";
import { hashPassword } from "@/lib/auth";
import { toApiError } from "@/lib/apiError";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function GET() {
  const session = await getCurrentSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const owners = await prisma.user.findMany({
    where: { role: "OWNER" },
    orderBy: { createdAt: "desc" },
    include: { restaurant: true },
  });

  return NextResponse.json(
    owners.map((o) => ({
      id: o.id,
      email: o.email,
      restaurantName: o.restaurant?.name ?? null,
      restaurantSlug: o.restaurant?.slug ?? null,
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  let body: { email?: string; password?: string; restaurantName?: string; slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password;
  const restaurantName = body.restaurantName?.trim();
  const slug = body.slug?.trim().toLowerCase();

  if (!email || !password || !restaurantName || !slug) {
    return NextResponse.json(
      { error: "ایمیل، رمز عبور، نام رستوران و آدرس منو الزامی است" },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "فرمت ایمیل معتبر نیست" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "رمز عبور باید حداقل ۶ کاراکتر باشد" }, { status: 400 });
  }
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json(
      { error: "آدرس منو فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد" },
      { status: 400 }
    );
  }

  try {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: "این ایمیل قبلاً ثبت شده است" }, { status: 409 });
    }
    const existingSlug = await prisma.restaurant.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json(
        { error: "این آدرس منو قبلاً استفاده شده، یک آدرس دیگر انتخاب کنید" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "OWNER",
        restaurant: { create: { name: restaurantName, slug } },
      },
      include: { restaurant: true },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      restaurantName: user.restaurant?.name,
      restaurantSlug: user.restaurant?.slug,
    });
  } catch (err) {
    console.error("create owner error:", err);
    const { message, status } = toApiError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
