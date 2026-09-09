// منوی «کافه نقطه» (اینستاگرام: cafe.noghteh) را در دیتابیس می‌نشاند و
// تصویرهای آیتم‌ها را با قالبِ یکدستِ prisma/noghteh-art.js می‌سازد.
//
// اجرا: node prisma/seed-noghteh.js
// یا:   npm run seed:noghteh
//
// اسکریپت idempotent است: دسته‌بندی‌های قبلیِ همین رستوران را پاک و از نو
// می‌سازد، پس اجرای دوباره‌اش منو را دقیقاً به همین حالت برمی‌گرداند.
//
// ساختارِ منو از صفحه‌ی عمومیِ خودِ کافه (لینکِ بیوی اینستاگرام) گرفته شده.
// دو نکته‌ی تبدیل:
//   ۱. آنجا «قهوه» یک دسته با دو زیرگروهِ گرم/سرد است؛ اسکیمای ما زیرگروه
//      ندارد، پس به دو دسته‌ی «قهوه گرم» و «قهوه سرد» تقسیم شده.
//   ۲. طعم‌ها و تنه‌های قلیان که آنجا «جزئیات بیشتر» بودند، در توضیحِ آیتم
//      ادغام شده‌اند.

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { glyphFor, buildSvg, fileNameFor } = require("./noghteh-art");

const prisma = new PrismaClient();

const OWNER_EMAIL = "noghte@gamil.com";
const SLUG = "noghteh";
const IMAGE_DIR = path.join(__dirname, "..", "public", "uploads", "noghteh");
const IMAGE_URL_BASE = "/uploads/noghteh";

const restaurant = {
  name: "کافه نقطه",
  slug: SLUG,
  businessType: "کافه",
  description: "نقطه مبدأ همه است، و مقصد همه.",
  address: "تهران، خیابان شهید بهشتی، نرسیده به سرافراز، نمره ۳۶۰",
  locationUrl: "https://maps.google.com/maps?q=35.729169,51.421046",
  instagram: "cafe.noghteh",
  accentColor: "#123b28",
  pattern: "dots",
};

// قیمت‌ها به تومان. ترتیبِ دسته‌ها همان ترتیبِ نوارِ منوی خودِ کافه است.
const categories = [
  {
    name: "جذبه",
    items: [
      {
        name: "قلیان با سری عربی",
        price: 500000,
        description:
          "طعم‌های موجود: هندوانه یخ، پرتقال نعنا، لیمو نعنا، شب‌های مسکو، دوسیب نخل، دوسیب فاخر، دوسیب میکس، دوسیب آلبالو، دوسیب نعنا، دوسیب شلیل، انگور نعنا، آدامس دارچین، ویژه نقطه و لاو — تنه‌های موجود: کرنو، خلیل مامون، حاج اوغلی",
      },
      { name: "تعویض سری قلیان", price: 350000 },
    ],
  },
  {
    name: "پخته",
    items: [
      { name: "کتلت", price: 400000 },
      { name: "الویه", price: 400000 },
      { name: "بندری", price: 400000 },
      { name: "کشک بادمجان", price: 400000 },
      { name: "سوسیس تخم مرغ", price: 250000 },
      { name: "املت", price: 200000 },
      { name: "نیمرو", price: 150000 },
      { name: "سرویس ترکیبی", price: 600000 },
      { name: "نان اضافه", price: 5000 },
    ],
  },
  {
    name: "لقمه",
    items: [
      { name: "نان، پنیر و هندوانه", price: 150000 },
      { name: "نان، پنیر، خیار، گوجه و سبزی", price: 120000 },
    ],
  },
  {
    name: "جرعه",
    items: [
      { name: "شربت بهار نارنج و زعفران", price: 120000 },
      { name: "شربت خیار سکنجبین", price: 120000 },
      { name: "شربت سرکه شیره", price: 120000 },
      { name: "شربت بیدمشک لیمو", price: 120000 },
      { name: "دوغ معجون", price: 80000 },
      { name: "آب معدنی", price: 20000 },
      { name: "سرویس ماءالشعیر", price: 120000 },
      { name: "لیموناد شیشه‌ای", price: 100000 },
      { name: "نوشابه شیشه‌ای", price: 100000 },
    ],
  },
  {
    name: "قهوه گرم",
    items: [
      { name: "اسپرسو ۱۰۰٪", price: 265000 },
      { name: "اسپرسو ۶۰٪", price: 225000 },
      { name: "آمریکانو ۱۰۰٪", price: 270000 },
      { name: "آمریکانو ۶۰٪", price: 220000 },
      { name: "کارامل ماکیاتو ۱۰۰٪", price: 360000 },
      { name: "کارامل ماکیاتو ۶۰٪", price: 310000 },
      { name: "کورتادو ۱۰۰٪", price: 285000 },
      { name: "کورتادو ۶۰٪", price: 235000 },
      { name: "کاپوچینو ۱۰۰٪", price: 310000 },
      { name: "کاپوچینو ۶۰٪", price: 255000 },
      { name: "لاته ۱۰۰٪", price: 325000 },
      { name: "لاته ۶۰٪", price: 275000 },
      { name: "موکا ۱۰۰٪", price: 360000 },
      { name: "موکا ۶۰٪", price: 310000 },
      { name: "ماچا لاته ۶۰٪", price: 250000 },
    ],
  },
  {
    name: "قهوه سرد",
    items: [
      { name: "کلدبرو کلمبیا هویلا", price: 340000 },
      { name: "سودا اسپرسو ۱۰۰٪", price: 265000 },
      { name: "سودا اسپرسو ۶۰٪", price: 225000 },
      { name: "آیس آمریکانو ۱۰۰٪", price: 270000 },
      { name: "آیس آمریکانو ۶۰٪", price: 220000 },
      { name: "آیس کارامل ماکیاتو ۱۰۰٪", price: 360000 },
      { name: "آیس کارامل ماکیاتو ۶۰٪", price: 310000 },
      { name: "آفوگاتو ۱۰۰٪", price: 360000 },
      { name: "آفوگاتو ۶۰٪", price: 310000 },
      { name: "آیس لاته ۱۰۰٪", price: 325000 },
      { name: "آیس لاته ۶۰٪", price: 275000 },
      { name: "آیس موکا ۱۰۰٪", price: 360000 },
      { name: "آیس موکا ۶۰٪", price: 310000 },
      { name: "آیس ماچا لاته ۶۰٪", price: 250000 },
    ],
  },
  {
    name: "مزه",
    items: [
      { name: "ظرف آجیل", price: 600000 },
      { name: "ظرف میوه", price: 120000 },
      { name: "زیتون", price: 70000 },
      { name: "زیتون پرورده", price: 80000 },
    ],
  },
  {
    name: "خاصّه",
    items: [{ name: "اتاق VIP", price: 800000, description: "یک ساعت" }],
  },
];

// نقشِ سرتیترِ هر دسته
const CATEGORY_GLYPH = {
  "جذبه": "hookah",
  "پخته": "pan",
  "لقمه": "breadCheese",
  "جرعه": "sharbat",
  "قهوه گرم": "cupHot",
  "قهوه سرد": "glassCold",
  "مزه": "nuts",
  "خاصّه": "door",
};

// تصویر را می‌سازد (اگر نبود) و آدرسِ عمومی‌اش را برمی‌گرداند.
function makeImage(glyphName, seed, variant) {
  const file = fileNameFor(glyphName, `${variant}:${seed}`);
  fs.writeFileSync(path.join(IMAGE_DIR, file), buildSvg(glyphName, seed, variant), "utf8");
  return `${IMAGE_URL_BASE}/${file}`;
}

async function main() {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });

  // لوگو باید از قبل در public/uploads/noghteh/logo.png باشد
  const logoPath = path.join(IMAGE_DIR, "logo.png");
  const logoUrl = fs.existsSync(logoPath) ? `${IMAGE_URL_BASE}/logo.png` : null;
  if (!logoUrl) console.warn("هشدار: logo.png پیدا نشد، لوگو خالی می‌ماند.");

  const owner = await prisma.user.findUnique({
    where: { email: OWNER_EMAIL },
    include: { restaurant: true },
  });
  if (!owner || !owner.restaurant) {
    throw new Error(`مالکِ ${OWNER_EMAIL} یا رستورانش پیدا نشد.`);
  }
  const restaurantId = owner.restaurant.id;

  const removed = await prisma.category.deleteMany({ where: { restaurantId } });
  console.log(`دسته‌بندی‌های قبلی پاک شد: ${removed.count}`);

  await prisma.restaurant.update({
    where: { id: restaurantId },
    data: { ...restaurant, logoUrl },
  });

  let items = 0;
  for (const [catIndex, cat] of categories.entries()) {
    await prisma.category.create({
      data: {
        name: cat.name,
        order: catIndex,
        restaurantId,
        imageUrl: makeImage(CATEGORY_GLYPH[cat.name], cat.name, "light"),
        items: {
          create: cat.items.map((item, itemIndex) => ({
            name: item.name,
            description: item.description ?? null,
            price: item.price,
            order: itemIndex,
            imageUrl: makeImage(glyphFor(item.name), item.name, "dark"),
          })),
        },
      },
    });
    items += cat.items.length;
  }

  console.log(`«${restaurant.name}» نشانده شد: ${categories.length} دسته، ${items} آیتم`);
  console.log(`منوی عمومی: /menu/${SLUG}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
