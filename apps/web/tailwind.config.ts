import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0047AB",
          dark: "#00357f",
          light: "#e8f0ff",
        },
      },
      boxShadow: {
        card: "0 10px 30px rgba(0, 71, 171, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
