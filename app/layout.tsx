import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-worksans",
  weight: ["400", "500", "600"],
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
      <body className={`${fraunces.variable} ${workSans.variable} font-body bg-paper text-ink`}>
        {children}
      </body>
    </html>
  );
}
