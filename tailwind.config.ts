import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF7F0",
        foreground: "#2F2F2F",
        play: "#7DB7E8",
        rest: "#8FD6A4",
        mandatory: "#F6A96B",
        quality: "#F4D35E",
        procrastination: "#F28482",
        empty: "#E5E7EB",
      },
      boxShadow: {
        soft: "0 10px 35px rgba(82, 72, 57, 0.08)",
        coin: "inset 0 1px 0 rgba(255,255,255,.65), 0 4px 12px rgba(82,72,57,.08)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
