import type { Config } from "tailwindcss";

const percentages = [0, 10, 25, 33, 50, 66, 75];

const dolColors = [
  "black",
  "white",
  "dol-black",
  ...percentages.map((perc) => `dol-black/${perc}`),
  "dol-white",
  ...percentages.map((perc) => `dol-white/${perc}`),
  "dol-blue",
  ...percentages.map((perc) => `dol-blue/${perc}`),
  "dol-green",
  ...percentages.map((perc) => `dol-green/${perc}`),
  "dol-red",
  ...percentages.map((perc) => `dol-red/${perc}`),
  "dol-yellow",
  ...percentages.map((perc) => `dol-yellow/${perc}`),
];

const safelist = [
  ...dolColors.map((dolColor) => `text-${dolColor}`),
  ...dolColors.map((dolColor) => `bg-${dolColor}`),
  ...dolColors.map((dolColor) => `border-${dolColor}`),
  ...dolColors.map((dolColor) => `[&::-webkit-media-controls-panel]:bg-${dolColor}`),
  "border-l-gray-dark",
];

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "#00000000",
      black: "#000000",
      white: "#ffffff",
      "gray-extra-dark": "#222222",
      "gray-dark": "#333333",
      "gray-dark-2": "#3c3c3c",
      "gray-medium-dark": "#444444",
      "gray-medium": "#888888",
      "gray-light": "#cccccc",
      "off-white": "#faf9f6",
      "dol-black": "#111111",
      "dol-white": "#f4f4e4",
      "dol-blue": "#4362f0",
      "dol-green": "#5daa43",
      "dol-red": "#ac000f",
      "dol-yellow": "#ffdb00",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
  safelist,
} satisfies Config;
