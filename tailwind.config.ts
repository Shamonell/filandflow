import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      colors: {
        // Nouvelle palette artisanale et bien-être
        // Fond principal
        "bg-primary": "#FBF8F3",
        "bg-secondary": "#EEF4EE",
        // Couleur signature
        signature: {
          DEFAULT: "#6F8F72",
          light: "#8FA892",
          dark: "#5A726D",
        },
        // Accent chaud (hover, CTA secondaires)
        accent: {
          DEFAULT: "#C76B3A",
          light: "#D88A5F",
          dark: "#A8552A",
        },
        // Titres forts
        heading: {
          DEFAULT: "#5C3A21",
          light: "#7A5A3F",
        },
        // Texte
        "text-primary": "#1F2933",
        "text-secondary": "#5F6C72",
        // Anciennes couleurs conservées pour compatibilité
        primary: {
          50: "#ffffff",
          100: "#fefefe",
          200: "#fafafa",
          300: "#f5f3f0",
          400: "#ebe8e3",
          500: "#e0dcd5",
          600: "#d4cec5",
          700: "#a8c5a0",
          800: "#8fb385",
          900: "#6b8e6b",
        },
        almond: {
          50: "#f0f7f0",
          100: "#d9ead9",
          200: "#b8d5b8",
          300: "#8fb385",
          400: "#6b8e6b",
          500: "#5a7a5a",
        },
        olive: {
          50: "#f4f6f2",
          100: "#e3e8dc",
          200: "#c8d2b8",
          300: "#a8b88f",
          400: "#8a9a6f",
          500: "#6b7a55",
        },
        beige: {
          50: "#faf9f7",
          100: "#f5f3f0",
          200: "#ebe8e3",
          300: "#e0dcd5",
          400: "#d4cec5",
          500: "#c4bdb3",
        },
      },
    },
  },
  plugins: [],
};
export default config;


