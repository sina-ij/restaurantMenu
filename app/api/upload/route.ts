import { NextRequest, NextResponse } from "next/server";
import { getCurrentRestaurant } from "@/lib/getCurrentRestaurant";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// توجه: این پیاده‌سازی برای توسعه/دمو مناسب است.
// برای دیپلوی روی سرورهای serverless (مثل Vercel) باید از
// یک سرویس ابری مثل Cloudinary یا S3 استفاده کنید، چون
// فایل‌سیستم این پلتفرم‌ها موقتی/فقط‌خواندنی است.
export async function POST(req: NextRequest) {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "فایلی ارسال نشده" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "فقط فرمت‌های jpg، png و webp مجاز است" },
      { status: 400 }
    );
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "حجم فایل نباید بیشتر از ۵ مگابایت باشد" },
      { status: 400 }
    );
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split(".").pop();
    const filename = `${restaurant.id}-${Date.now()}.${ext}`;
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("upload error:", err);
    return NextResponse.json(
      { error: "خطایی در آپلود فایل رخ داد. لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
