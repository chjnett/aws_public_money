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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom Beige/Brown Theme
        cream: {
          50: '#FFFDF5', // Main background (Ivory)
          100: '#FDFBF0',
          200: '#F4EEDA',
          300: '#E9DFC0',
          400: '#DBCBA0',
          500: '#C7B280',
          600: '#A18C5F',
        },
        brown: {
          50: '#FAF6F4',
          100: '#F3EBE7',
          200: '#E6D7D2',
          300: '#D3B8AE',
          400: '#B08D84',
          500: '#8D6E63', // Secondary Text
          600: '#795548',
          700: '#5D4037', // Primary Text
          800: '#4E342E',
          900: '#3E2723',
        },
      },
    },
  },
  plugins: [],
};
export default config;
