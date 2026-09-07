// این اسکریپت چند رستوران/کافه‌ی نمونه با دسته‌بندی، آیتم، عکس (از
// picsum.photos) و اطلاعات کامل می‌سازه تا بشه ظاهر واقعی برنامه رو
// با داده‌ی واقعی تست کرد. اجرای دوباره‌ش بی‌خطره — اگه ایمیل مالک از
// قبل وجود داشته باشه، اون رستوران رو دوباره نمی‌سازه.
//
// اجرا: node prisma/seed-demo-data.js
// یا:   npm run seed:demo

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DEMO_PASSWORD = "demo1234";

function img(seed, w = 480, h = 360) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const restaurants = [
  {
    ownerEmail: "demo-cafe@example.com",
    name: "کافه گلستان",
    slug: "golestan-demo",
    description:
      "کافه‌ای دنج در قلب شهر با قهوه‌ی تازه‌دم، دسرهای خانگی و فضایی آرام برای دورهمی‌های شما.",
    phone: "021-88112233",
    address: "تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۴۵",
    workingHours: "هر روز ۸ صبح تا ۱۲ شب",
    locationUrl: "https://maps.google.com/?q=35.7595,51.4088",
    logoUrl: img("golestan-logo", 200, 200),
    categories: [
      {
        name: "نوشیدنی گرم",
        imageUrl: img("golestan-hot-drinks"),
        items: [
          { name: "اسپرسو", description: "دو شات اسپرسوی خالص", price: 65000, imageUrl: img("espresso") },
          { name: "کاپوچینو", description: "اسپرسو با فوم شیر ابریشمی", price: 85000, imageUrl: img("cappuccino") },
          { name: "لاته وانیل", description: "لاته با شربت وانیل فرانسوی", price: 95000, imageUrl: img("vanilla-latte") },
          { name: "موکا", description: "ترکیب قهوه و شکلات تلخ", price: 105000, imageUrl: img("mocha"), available: false },
        ],
      },
      {
        name: "نوشیدنی سرد",
        imageUrl: img("golestan-cold-drinks"),
        items: [
          { name: "آیس‌آمریکانو", description: "اسپرسوی رقیق‌شده روی یخ", price: 75000, imageUrl: img("iced-americano") },
          { name: "آیس‌لاته کارامل", description: "لاته سرد با سس کارامل", price: 98000, imageUrl: img("caramel-latte") },
          { name: "اسموتی توت‌فرنگی", description: "توت‌فرنگی تازه با ماست و عسل", price: 120000, imageUrl: img("strawberry-smoothie") },
        ],
      },
      {
        name: "دسر",
        imageUrl: img("golestan-dessert"),
        items: [
          { name: "چیزکیک نیویورکی", description: "چیزکیک کلاسیک با سس توت‌فرنگی", price: 145000, imageUrl: img("cheesecake") },
          { name: "تیرامیسو", description: "دسر ایتالیایی با قهوه و ماسکارپونه", price: 135000, imageUrl: img("tiramisu") },
          { name: "براونی با بستنی وانیل", description: "براونی گرم با یک اسکوپ بستنی", price: 110000, imageUrl: img("brownie"), available: false },
        ],
      },
    ],
  },
  {
    ownerEmail: "demo-restaurant@example.com",
    name: "رستوران باغچه",
    slug: "baghche-demo",
    description:
      "طعم اصیل غذای ایرانی در فضایی سنتی و دنج، با بهترین مواد اولیه‌ی تازه.",
    phone: "021-77445566",
    address: "تهران، خیابان فرشته، کوچه سوم، پلاک ۱۲",
    workingHours: "هر روز ۱۲ ظهر تا ۱۱ شب",
    locationUrl: "https://maps.google.com/?q=35.8046,51.4247",
    logoUrl: img("baghche-logo", 200, 200),
    categories: [
      {
        name: "پیش‌غذا",
        imageUrl: img("baghche-starters"),
        items: [
          { name: "سالاد شیرازی", description: "خیار، گوجه، پیاز با آبلیمو و نعنا", price: 85000, imageUrl: img("shirazi-salad") },
          { name: "ماست و خیار", description: "ماست چکیده با خیار و نعنای تازه", price: 65000, imageUrl: img("yogurt-cucumber") },
          { name: "زیتون پرورده", description: "زیتون با گردو، انار و سبزی معطر", price: 70000, imageUrl: img("olive-appetizer") },
        ],
      },
      {
        name: "غذای اصلی",
        imageUrl: img("baghche-mains"),
        items: [
          { name: "چلوکباب کوبیده", description: "دو سیخ کباب کوبیده با برنج ایرانی", price: 285000, imageUrl: img("koobideh") },
          { name: "جوجه‌کباب زعفرانی", description: "جوجه‌کباب مزه‌دار شده با زعفران", price: 320000, imageUrl: img("joojeh-kabab") },
          { name: "قورمه‌سبزی", description: "خورش سبزی با گوشت گوسفندی و لوبیا قرمز", price: 240000, imageUrl: img("ghormeh-sabzi") },
          { name: "فسنجان", description: "خورش گردو و رب انار با مرغ", price: 260000, imageUrl: img("fesenjan"), available: false },
        ],
      },
      {
        name: "نوشیدنی",
        imageUrl: img("baghche-drinks"),
        items: [
          { name: "دوغ خانگی", description: "دوغ سنتی با نعنای خشک", price: 40000, imageUrl: img("doogh") },
          { name: "نوشابه", description: "نوشابه‌ی قوطی خنک", price: 35000, imageUrl: img("soda") },
          { name: "آب‌میوه‌ی طبیعی", description: "آب پرتقال یا هویج تازه", price: 55000, imageUrl: img("fresh-juice") },
        ],
      },
    ],
  },
];

async function main() {
  for (const r of restaurants) {
    const existing = await prisma.user.findUnique({ where: { email: r.ownerEmail } });
    if (existing) {
      console.log("رد شد (از قبل وجود دارد):", r.ownerEmail);
      continue;
    }

    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    await prisma.user.create({
      data: {
        email: r.ownerEmail,
        passwordHash,
        role: "OWNER",
        restaurant: {
          create: {
            name: r.name,
            slug: r.slug,
            description: r.description,
            phone: r.phone,
            address: r.address,
            workingHours: r.workingHours,
            locationUrl: r.locationUrl,
            logoUrl: r.logoUrl,
            categories: {
              create: r.categories.map((cat, catIndex) => ({
                name: cat.name,
                imageUrl: cat.imageUrl,
                order: catIndex,
                items: {
                  create: cat.items.map((item, itemIndex) => ({
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    imageUrl: item.imageUrl,
                    available: item.available !== false,
                    order: itemIndex,
                  })),
                },
              })),
            },
          },
        },
      },
    });

    console.log(`ساخته شد: ${r.name} — ورود با ${r.ownerEmail} / ${DEMO_PASSWORD}`);
    console.log(`  منوی عمومی: /menu/${r.slug}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
