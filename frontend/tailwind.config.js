/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          0: "#ffffff",
          1: "#f8f9fb",
          2: "#f1f3f7",
          3: "#e8ebf0",
        },
        ink: {
          900: "#0f1729",
          700: "#2d3654",
          500: "#5a6178",
          400: "#7c8298",
          300: "#a3a8b8",
          200: "#c8ccd6",
          100: "#e4e7ed",
        },
        accent: {
          DEFAULT: "#4f46e5",
          light: "#818cf8",
          dark: "#3730a3",
          muted: "#eef2ff",
        },
        success: {
          DEFAULT: "#059669",
          light: "#d1fae5",
        },
        warn: {
          DEFAULT: "#d97706",
          light: "#fef3c7",
        },
        danger: {
          DEFAULT: "#dc2626",
          light: "#fee2e2",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Plus Jakarta Sans"', '"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        card: "0 2px 8px -2px rgb(0 0 0 / 0.06), 0 1px 3px -1px rgb(0 0 0 / 0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.15s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
