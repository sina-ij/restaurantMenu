// قالبِ یکدستِ تصویرِ آیتم‌های «کافه نقطه».
//
// کافه عکسِ تک‌تکِ غذاها را منتشر نکرده، برای همین به جای عکس، یک قالبِ
// واحد می‌سازیم: بوم مربعِ ۹۰۰×۹۰۰ با پس‌زمینه‌ی سبزِ برند، بافتِ نقطه‌چین
// (اشاره به اسمِ «نقطه») و یک نقشِ خطیِ کرم‌رنگ در وسط. همه‌ی تصویرها یک
// ترکیب‌بندیِ ثابت دارند و فقط نقش و ته‌رنگِ پس‌زمینه‌شان فرق می‌کند.
//
// چرا مربع و چرا نقش وسط: کارتِ آیتم عکس را ۸۰×۸۰ (مربع) و مودالِ آیتم
// همان عکس را در نوارِ ~۲:۱ نشان می‌دهد. هر دو object-cover هستند، پس
// بُرشِ مودال فقط نوارِ y ∈ [۲۲۵, ۶۷۵] را نگه می‌دارد. نقش را داخلِ
// همان نوارِ امن (۲۳۰ تا ۶۷۰) می‌کشیم تا در هیچ‌کدام بریده نشود.

const BRAND = {
  green: "#123b28",
  greenDeep: "#0b2c1d",
  cream: "#f5edc9",
  gold: "#cfb16b",
};

// سه ته‌رنگِ پس‌زمینه از یک خانواده، تا آیتم‌های کنارِ هم عینِ هم نباشند
// ولی همچنان یک مجموعه به نظر برسند.
const SHADES = [
  ["#154331", "#0b2c1d"],
  ["#123b28", "#091f15"],
  ["#1a4c36", "#0e3323"],
];

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
}

// ————— نقش‌ها —————
// همه در یک جعبه‌ی ۳۶۰×۳۶۰ کشیده می‌شوند و بعد به مرکزِ بوم منتقل می‌شوند.
// فقط خط (stroke) و بدونِ پُرکردن، تا سبکشان یکسان بماند.

const GLYPHS = {
  // قلیان: بدنه‌ی شکمی، لوله‌ی بلند، سرِ عربی و شیلنگ
  hookah: `
    <path d="M158 192v32c0 14-52 34-52 82 0 30 34 46 74 46s74-16 74-46c0-48-52-68-52-82v-32z"/>
    <path d="M158 192h44"/>
    <path d="M180 192V96"/>
    <path d="M128 96h104"/>
    <path d="M148 96l8-46h48l8 46"/>
    <path d="M156 50h48"/>
    <path d="M180 140c74 4 112 46 106 92"/>
    <path d="M286 232c-2 16 8 24 20 24"/>`,

  // سرِ قلیان به‌تنهایی (تعویضِ سری)
  hookahHead: `
    <path d="M112 268h136"/>
    <path d="M132 268l20-124h56l20 124"/>
    <path d="M152 144h56"/>
    <path d="M150 144c0-42 60-42 60 0"/>
    <circle cx="164" cy="112" r="5"/>
    <circle cx="196" cy="112" r="5"/>
    <path d="M180 82V56"/>`,

  // فنجانِ قهوه‌ی گرم با بخار
  cupHot: `
    <path d="M104 152l22 116c5 26 25 42 54 42h40c29 0 49-16 54-42l22-116z"/>
    <path d="M96 152h168"/>
    <path d="M282 184c40-6 48 52 8 62"/>
    <path d="M86 330c56 22 132 22 188 0"/>
    <path d="M150 116c-14-18 14-32 0-52"/>
    <path d="M210 116c-14-18 14-32 0-52"/>`,

  // فنجانِ کوچک (اسپرسو، کورتادو)
  cupSmall: `
    <path d="M132 168l16 82c4 22 20 34 42 34h20c22 0 38-12 42-34l16-82z"/>
    <path d="M124 168h136"/>
    <path d="M274 194c30-4 36 40 6 48"/>
    <path d="M110 320c48 18 100 18 148 0"/>
    <path d="M192 132c-12-16 12-28 0-46"/>`,

  // ماگِ بلند (لاته، کاپوچینو، موکا، ماچا)
  mugTall: `
    <path d="M124 128h112v176c0 22-16 36-38 36h-36c-22 0-38-14-38-36z"/>
    <path d="M236 166c42 0 46 72 0 72"/>
    <path d="M124 202h112"/>
    <path d="M150 96c-12-16 12-28 0-46"/>
    <path d="M210 96c-12-16 12-28 0-46"/>`,

  // آفوگاتو: فنجان با اسکوپِ بستنی
  affogato: `
    <path d="M116 196l18 90c5 24 22 38 48 38h28c26 0 43-14 48-38l18-90z"/>
    <path d="M108 196h164"/>
    <path d="M270 222c36-4 42 48 4 56"/>
    <path d="M100 344c52 20 116 20 168 0"/>
    <path d="M138 196c8-56 100-56 108 0"/>
    <path d="M192 140V114"/>`,

  // لیوانِ بلندِ سرد با نی و یخ
  glassCold: `
    <path d="M116 96l24 216c2 18 15 30 34 30h32c19 0 32-12 34-30l24-216z"/>
    <path d="M108 96h144"/>
    <path d="M128 168h104"/>
    <path d="M236 60l-32 44"/>
    <path d="M236 60h26"/>
    <rect x="148" y="196" width="34" height="34" rx="6"/>
    <rect x="188" y="238" width="34" height="34" rx="6"/>`,

  // شربت: لیوانِ بلند، برشِ مرکبات روی لبه و برگِ نعنا
  sharbat: `
    <path d="M120 108l24 204c2 18 15 30 34 30h28c19 0 32-12 34-30l24-204z"/>
    <path d="M112 108h144"/>
    <path d="M132 180h96"/>
    <circle cx="252" cy="94" r="34"/>
    <path d="M252 60v68M218 94h68"/>
    <path d="M104 74c-32 6-30 44 4 42 20-2 30-20 26-42-16-4-24-2-30 0z"/>`,

  // بطری (آب معدنی، ماءالشعیر، نوشابه، لیموناد)
  bottle: `
    <path d="M150 68h60v56c0 30 40 44 40 84v112c0 16-12 28-28 28H138c-16 0-28-12-28-28V208c0-40 40-54 40-84z"/>
    <path d="M146 44h68v24h-68z"/>
    <path d="M110 214h140"/>
    <path d="M110 272h140"/>`,

  // نیمرو / املت
  friedEgg: `
    <path d="M92 208c-22-52 20-100 72-88 26-42 92-36 106 12 46 6 56 68 20 94 16 48-36 90-82 68-36 34-102 12-106-34-22-12-24-38-10-52z"/>
    <circle cx="176" cy="196" r="46"/>`,

  // ماهیتابه (بندری، سوسیس تخم‌مرغ)
  pan: `
    <path d="M74 156h182c0 100-40 152-91 152S74 256 74 156z"/>
    <path d="M62 156h206"/>
    <path d="M268 170l68-22"/>
    <circle cx="140" cy="214" r="18"/>
    <circle cx="196" cy="240" r="18"/>`,

  // کتلت روی بشقاب
  patty: `
    <path d="M180 130c58 0 100 26 100 58s-42 58-100 58-100-26-100-58 42-58 100-58z"/>
    <path d="M124 176c34 14 88 14 122 0"/>
    <path d="M64 254c58 40 174 40 232 0"/>`,

  // کاسه (الویه، کشک بادمجان)
  bowl: `
    <path d="M76 186c0 92 40 132 104 132s104-40 104-132z"/>
    <path d="M62 186h236"/>
    <path d="M104 186c12-56 132-56 144 0"/>
    <circle cx="180" cy="140" r="10"/>`,

  // سرویسِ ترکیبی: سینی بزرگ با چند خوراک
  platter: `
    <path d="M180 178c76 0 138 26 138 58s-62 58-138 58S42 268 42 236s62-58 138-58z"/>
    <path d="M64 236c50 22 182 22 232 0"/>
    <circle cx="112" cy="140" r="30"/>
    <circle cx="180" cy="122" r="30"/>
    <circle cx="248" cy="140" r="30"/>`,

  // نان (بربری)
  bread: `
    <path d="M84 128h192c26 0 40 22 40 52s-14 52-40 52H84c-26 0-40-22-40-52s14-52 40-52z"/>
    <path d="M112 156v96M160 156v96M208 156v96M256 156v96"/>`,

  // لقمه: نان و پنیر
  breadCheese: `
    <path d="M76 264v-72c0-46 84-46 84 0v72z"/>
    <path d="M76 192c0-46 84-46 84 0"/>
    <path d="M196 264l64-88 64 88z"/>
    <path d="M196 264h128"/>
    <circle cx="260" cy="228" r="9"/>
    <circle cx="238" cy="252" r="7"/>`,

  // نان، پنیر و هندوانه
  breadMelon: `
    <path d="M62 262v-70c0-44 82-44 82 0v70z"/>
    <path d="M62 192c0-44 82-44 82 0"/>
    <path d="M182 154c62 0 116 44 116 108H182z"/>
    <path d="M182 190c42 0 78 30 78 72"/>
    <circle cx="228" cy="228" r="7"/>
    <circle cx="256" cy="248" r="7"/>`,

  // ظرفِ آجیل
  nuts: `
    <path d="M76 200c0 90 40 128 104 128s104-38 104-128z"/>
    <path d="M62 200h236"/>
    <path d="M124 200c-16-30 4-58 32-58s44 28 30 58"/>
    <path d="M198 200c-14-26 4-50 28-50s40 24 28 50"/>
    <path d="M150 142c8-24 34-34 52-22"/>`,

  // ظرفِ میوه
  fruit: `
    <path d="M180 140c-48-20-88 18-84 68 4 56 46 90 84 76 38 14 80-20 84-76 4-50-36-88-84-68z"/>
    <path d="M180 140V98"/>
    <path d="M180 112c26-30 58-26 58-26 0 30-26 40-58 26z"/>
    <path d="M64 300c60 34 172 34 232 0"/>`,

  // زیتون
  olive: `
    <path d="M80 246c26 46 174 46 200 0z"/>
    <path d="M68 246h224"/>
    <ellipse cx="126" cy="192" rx="34" ry="46"/>
    <ellipse cx="200" cy="176" rx="34" ry="46"/>
    <path d="M126 176v32M200 160v32"/>
    <path d="M248 210c22-26 22-58 8-78"/>`,

  // خاصّه: طاقِ اتاقِ اختصاصی
  door: `
    <path d="M100 330V178c0-58 38-100 80-136 42 36 80 78 80 136v152z"/>
    <path d="M132 330V184c0-42 26-74 48-98 22 24 48 56 48 98v146z"/>
    <circle cx="196" cy="266" r="9"/>
    <path d="M76 330h208"/>`,
};

// کادرِ واقعیِ هر نقش [x, y, w, h] داخلِ جعبه‌ی ۳۶۰×۳۶۰.
// نقش‌ها دستی کشیده شده‌اند و هرکدام کادرِ خودش را دارد (نان پهن و کوتاه است،
// بطری باریک و بلند). بدونِ نرمال‌سازی، هرکدام در تصویر یک اندازه‌ی دیگر
// می‌افتاد و مجموعه یکدست به نظر نمی‌رسید. این عددها با getBBox در مرورگر
// اندازه‌گیری شده‌اند؛ اگر نقشی را عوض کردی، دوباره اندازه بگیر.
const BOXES = {
  hookah: [106, 50, 200, 302],
  hookahHead: [112, 56, 136, 212],
  cupHot: [86, 64, 230, 283],
  cupSmall: [110, 86, 190, 248],
  mugTall: [124, 50, 145, 290],
  affogato: [100, 114, 200, 245],
  glassCold: [108, 60, 156, 282],
  sharbat: [81, 60, 205, 282],
  bottle: [110, 44, 140, 304],
  friedEgg: [83, 92, 229, 219],
  pan: [62, 148, 274, 160],
  patty: [64, 130, 232, 154],
  bowl: [62, 130, 236, 188],
  platter: [42, 92, 276, 202],
  bread: [44, 128, 272, 124],
  breadCheese: [76, 158, 248, 107],
  breadMelon: [62, 154, 236, 108],
  nuts: [62, 115, 236, 213],
  fruit: [64, 86, 232, 240],
  olive: [68, 130, 224, 151],
  door: [76, 42, 208, 288],
};

// آیتم‌ها را به نقش وصل می‌کند. کلیدْ نامِ فارسیِ آیتم است.
function glyphFor(name) {
  const has = (...words) => words.some((w) => name.includes(w));
  if (has("تعویض سری")) return "hookahHead";
  if (has("قلیان")) return "hookah";
  if (has("اتاق")) return "door";
  if (has("آجیل")) return "nuts";
  if (has("میوه")) return "fruit";
  if (has("زیتون")) return "olive";
  if (has("هندوانه")) return "breadMelon";
  if (has("پنیر")) return "breadCheese";
  if (has("نان")) return "bread";
  if (has("نیمرو", "املت")) return "friedEgg";
  if (has("بندری", "سوسیس")) return "pan";
  if (has("کتلت")) return "patty";
  if (has("الویه", "کشک")) return "bowl";
  if (has("سرویس ترکیبی")) return "platter";
  if (has("شربت", "دوغ")) return "sharbat";
  if (has("آب معدنی", "ماءالشعیر", "لیموناد", "نوشابه")) return "bottle";
  if (has("آفوگاتو")) return "affogato";
  if (has("آیس", "کلدبرو", "سودا")) return "glassCold";
  if (has("اسپرسو", "کورتادو")) return "cupSmall";
  if (has("لاته", "کاپوچینو", "موکا")) return "mugTall";
  return "cupHot";
}

// یک تصویرِ SVG با قالبِ ثابت می‌سازد.
// variant: "dark" برای آیتم‌ها (زمینه سبز، نقش کرم) و "light" برای
// دسته‌بندی‌ها (زمینه کرم، نقش سبز) تا سرتیترها از آیتم‌ها جدا دیده شوند.
function buildSvg(glyphName, seed, variant = "dark") {
  const glyph = GLYPHS[glyphName];
  if (!glyph) throw new Error(`نقشِ ناشناخته: ${glyphName}`);

  const h = hash(seed);
  const [from, to] = SHADES[h % SHADES.length];
  const phase = h % 48; // فازِ بافتِ نقطه‌چین، تا دو تصویر عینِ هم نشوند

  const bgFrom = variant === "dark" ? from : BRAND.cream;
  const bgTo = variant === "dark" ? to : "#e7dcae";
  const line = variant === "dark" ? BRAND.cream : BRAND.green;
  const dot = variant === "dark" ? BRAND.cream : BRAND.green;
  const ring = variant === "dark" ? BRAND.gold : BRAND.green;

  // نقش را طوری جا می‌دهیم که کادرِ واقعی‌اش (نه جعبه‌ی اسمی‌اش) دقیقاً در
  // مربعِ GLYPH_BOX وسطِ بوم بنشیند. نتیجه: همه‌ی نقش‌ها هم‌اندازه دیده
  // می‌شوند. ۴۴۰ در مرکزِ ۹۰۰ یعنی y ∈ [۲۳۰, ۶۷۰] که داخلِ نوارِ امنِ
  // بُرشِ ۲:۱ مودال ([۲۲۵, ۶۷۵]) می‌ماند.
  const GLYPH_BOX = 440;
  const STROKE = 17; // ضخامتِ نهاییِ خط روی بوم، یکسان برای همه‌ی نقش‌ها
  const [bx, by, bw, bh] = BOXES[glyphName];
  const scale = (GLYPH_BOX - STROKE) / Math.max(bw, bh);
  const cx = bx + bw / 2;
  const cy = by + bh / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900" width="900" height="900" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bgFrom}"/>
      <stop offset="1" stop-color="${bgTo}"/>
    </linearGradient>
    <pattern id="dots" x="${phase}" y="${phase}" width="60" height="60" patternUnits="userSpaceOnUse">
      <circle cx="30" cy="30" r="3.2" fill="${dot}" opacity="0.14"/>
    </pattern>
    <radialGradient id="vignette" cx="0.5" cy="0.46" r="0.72">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="${variant === "dark" ? 0.28 : 0.12}"/>
    </radialGradient>
  </defs>

  <rect width="900" height="900" fill="url(#bg)"/>
  <rect width="900" height="900" fill="url(#dots)"/>

  <!-- لوزیِ کم‌رنگ، اشاره به نشانِ برند -->
  <rect x="215" y="215" width="470" height="470" rx="70"
        transform="rotate(45 450 450)"
        fill="none" stroke="${ring}" stroke-width="3" opacity="0.16"/>

  <rect width="900" height="900" fill="url(#vignette)"/>

  <g transform="translate(450 450) scale(${scale.toFixed(4)}) translate(${-cx} ${-cy})"
     fill="none" stroke="${line}" stroke-width="${(STROKE / scale).toFixed(2)}"
     stroke-linecap="round" stroke-linejoin="round">
${glyph.trim().split("\n").map((l) => "    " + l.trim()).join("\n")}
  </g>
</svg>
`;
}

function fileNameFor(glyphName, seed) {
  return `${glyphName}-${hash(seed).toString(36).slice(0, 6)}.svg`;
}

module.exports = { BRAND, GLYPHS, glyphFor, buildSvg, fileNameFor, hash };
