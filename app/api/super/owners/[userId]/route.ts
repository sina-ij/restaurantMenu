import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/getCurrentRestaurant";
import { hashPassword } from "@/lib/auth";
import { toApiError } from "@/lib/apiError";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getCurrentSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const target = await prisma.user.findUnique({ where: { id: params.userId } });
  if (!target || target.role !== "OWNER") {
    return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password;

  if (!email && !password) {
    return NextResponse.json({ error: "ایمیل یا رمز عبور جدید را وارد کنید" }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "فرمت ایمیل معتبر نیست" }, { status: 400 });
  }
  if (password && password.length < 6) {
    return NextResponse.json({ error: "رمز عبور باید حداقل ۶ کاراکتر باشد" }, { status: 400 });
  }

  try {
    if (email && email !== target.email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return NextResponse.json({ error: "این ایمیل قبلاً ثبت شده است" }, { status: 409 });
      }
    }

    const updated = await prisma.user.update({
      where: { id: params.userId },
      data: {
        email: email || target.email,
        passwordHash: password ? await hashPassword(password) : target.passwordHash,
      },
    });

    return NextResponse.json({ id: updated.id, email: updated.email });
  } catch (err) {
    console.error("update owner error:", err);
    const { message, status } = toApiError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
