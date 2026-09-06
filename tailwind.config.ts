import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#221A13",
        paper: "#FBF6EC",
        card: "#FFFDF8",
        gold: "#AB7C33",
        saffron: "#AB7C33",
        wine: "#7A2B33",
        olive: "#5F6E45",
        muted: "#8B8072",
        line: "#221A13",
      },
      fontFamily: {
        display: ["var(--font-naskh)", "serif"],
        body: ["var(--font-vazirmatn)", "sans-serif"],
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
