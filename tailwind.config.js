module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        palette: {
          darkNavy: "#0B103C",
          deepBlue: "#1F4075",
          oceanBlue: "#3B82F6",
          metallicBlue: "#3B82F6",
          amberGold: "#E2AC3B",
          warmGold: "#F9DFA1",
        },
        primary: {
          DEFAULT: "#1F4075",
          dark: "#0B103C",
          metallic: "#3B82F6",
          on: "#ffffff",
        },
        background: {
          DEFAULT: "#F8F9FC",
          alt: "#EAF0F8",
          dark: "#0B103C",
          darkAlt: "#080B2B",
        },
        surface: {
          container: "#EAF0F8",
          dark: "#1F4075",
        },
        tertiary: {
          DEFAULT: "#E2AC3B",
        },
        accent: {
          DEFAULT: "#E2AC3B",
          gold: "#F9DFA1",
          metallic: "#3B82F6",
        },
        onBackground: {
          DEFAULT: "#0B103C",
          dark: "#F9DFA1",
        },
        outline: {
          DEFAULT: "#3B82F6",
          dark: "#1F4075",
        },
        error: "#ba1a1a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
        card: "16px",
      },
      boxShadow: {
        navy: "0 10px 30px -5px rgba(28, 78, 128, 0.2)",
        gold: "0 10px 30px -5px rgba(245, 158, 11, 0.25)",
      }
    },
  },
  plugins: [],
};
