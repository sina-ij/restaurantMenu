import type { Metadata } from "next";
import { Vazirmatn, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  weight: ["400", "500", "600", "700"],
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-naskh",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "منوی دیجیتال رستوران و کافه",
  description: "بساز، اسکن کن، سفارش بده — منوی دیجیتال برای رستوران و کافه شما",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} ${notoNaskh.variable} font-body bg-paper text-ink`}>
        {children}
      </body>
    </html>
  );
}
