import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        saffron: "rgb(var(--color-gold) / <alpha-value>)",
        wine: "rgb(var(--color-wine) / <alpha-value>)",
        olive: "rgb(var(--color-olive) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        line: "rgb(var(--color-ink) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-naskh)", "serif"],
        body: ["var(--font-vazirmatn)", "sans-serif"],
        brand: ["var(--font-brand)", "var(--font-naskh)", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(34, 26, 19, 0.06), 0 8px 24px -12px rgba(34, 26, 19, 0.18)",
        lift: "0 2px 4px rgba(34, 26, 19, 0.08), 0 16px 32px -16px rgba(34, 26, 19, 0.28)",
      },
    },
  },
  plugins: [],
};
export default config;
