const CONNECTION_CODES = ["P1000", "P1001", "P1002", "P1003", "P1008", "P1009", "P1010", "P1017"];
const SCHEMA_CODES = ["P2021", "P2022"];

export function toApiError(err: unknown): { message: string; status: number } {
  const e = err as { code?: string; errorCode?: string; name?: string; message?: string } | null;
  const code = e?.code || e?.errorCode;

  if (code && CONNECTION_CODES.includes(code)) {
    return {
      message:
        "اتصال به پایگاه‌داده برقرار نشد. مقدار DATABASE_URL در فایل .env را بررسی کنید.",
      status: 503,
    };
  }

  if (code && SCHEMA_CODES.includes(code)) {
    return {
      message:
        "جدول‌های دیتابیس پیدا نشد. دستور «npx prisma migrate dev» را اجرا کنید.",
      status: 503,
    };
  }

  if (code === "P2002") {
    return { message: "این مقدار قبلاً ثبت شده است.", status: 409 };
  }

  // برخی خطاهای اتصال (مثلاً PrismaClientInitializationError) کد مشخصی ندارند
  // و فقط از روی نام کلاس یا متن پیام قابل تشخیصن
  const isConnectionIssue =
    e?.name === "PrismaClientInitializationError" ||
    /can't reach database server|connection.*(closed|refused)|ECONNREFUSED|timed out/i.test(
      e?.message || ""
    );
  if (isConnectionIssue) {
    return {
      message:
        "اتصال به پایگاه‌داده برقرار نشد. مقدار DATABASE_URL در فایل .env را بررسی کنید.",
      status: 503,
    };
  }

  return {
    message: "خطای غیرمنتظره‌ای در سرور رخ داد. جزئیات در لاگ سرور ثبت شد.",
    status: 500,
  };
}
