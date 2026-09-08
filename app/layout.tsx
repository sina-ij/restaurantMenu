import type { Metadata } from "next";
import { Vazirmatn, Noto_Naskh_Arabic, Lalezar } from "next/font/google";
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

// فونتِ نامِ برند: نمایشی و متمایز، مناسبِ تابلو/نامِ رستوران.
const lalezar = Lalezar({
  subsets: ["arabic", "latin"],
  variable: "--font-brand",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "منوی دیجیتال رستوران و کافه",
  description: "بساز، اسکن کن، سفارش بده؛ منوی دیجیتال برای رستوران و کافه شما",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${vazirmatn.variable} ${notoNaskh.variable} ${lalezar.variable} font-body bg-paper text-ink`}>
        {children}
      </body>
    </html>
  );
}
