import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signSession, COOKIE_NAME } from "@/lib/auth";
import { toApiError } from "@/lib/apiError";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "اطلاعات ارسالی نامعتبر است" },
      { status: 400 }
    );
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json(
      { error: "ایمیل و رمز عبور الزامی است" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { restaurant: true },
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const token = await signSession({
      userId: user.id,
      role: user.role,
    });

    const res = NextResponse.json({ role: user.role, slug: user.restaurant?.slug });
    // کوکی فقط وقتی secure می‌شود که درخواست واقعاً HTTPS باشد (بر اساس
    // X-Forwarded-Proto که nginx می‌فرستد). این‌طوری روی HTTP هم کار می‌کند و
    // با فعال‌شدن HTTPS خودکار secure می‌شود. (NODE_ENV مبنای درستی نیست چون
    // یک دیپلویِ production ممکن است هنوز روی HTTP باشد.)
    const isHttps = req.headers.get("x-forwarded-proto") === "https";
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    console.error("login error:", err);
    const { message, status } = toApiError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
