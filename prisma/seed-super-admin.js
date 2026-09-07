// این اسکریپت یک حساب «ادمین اصلی» می‌سازه که می‌تونه رستوران‌دارهای
// جدید بسازه و رمز عبورشون رو تغییر بده. قبل از اجرا مقادیر
// SUPER_ADMIN_EMAIL و SUPER_ADMIN_PASSWORD رو در فایل .env تنظیم کن.
//
// اجرا: npx prisma db seed
// یا:   npm run seed:super-admin

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "خطا: مقدار SUPER_ADMIN_EMAIL و SUPER_ADMIN_PASSWORD را در فایل .env تنظیم کنید."
    );
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    if (existing.role !== "SUPER_ADMIN") {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: "SUPER_ADMIN" },
      });
      console.log("کاربر موجود به ادمین اصلی ارتقا یافت:", email);
    } else {
      console.log("ادمین اصلی از قبل با این ایمیل وجود دارد:", email);
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, passwordHash, role: "SUPER_ADMIN" },
  });
  console.log("ادمین اصلی ساخته شد:", email);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
