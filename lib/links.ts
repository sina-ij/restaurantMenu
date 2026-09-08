// اینستاگرام را از آی‌دی یا لینکِ کامل به یک URLِ معتبر تبدیل می‌کند.
export function instagramUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const v = value.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^@+/, "").replace(/^instagram\.com\//i, "");
  if (!handle) return null;
  return `https://instagram.com/${handle}`;
}
