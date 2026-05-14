import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1A47B8",
          dark: "#12358F",
          light: "#EEF3FF",
          navy: "#0F2F6D",
        },
        accent: {
          orange: "#F97316",
          green: "#22C55E",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F4F6FA",
          line: "#E4E9F2",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 12px 40px rgba(26, 71, 184, 0.08)",
        panel: "0 18px 50px rgba(15, 47, 109, 0.12)",
        float: "0 10px 30px rgba(15, 47, 109, 0.16)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 28%), linear-gradient(135deg, #1A47B8 0%, #12358F 55%, #0F2F6D 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
