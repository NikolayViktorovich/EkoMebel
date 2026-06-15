/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcf2",
          100: "#d6f5e0",
          200: "#b0e9c4",
          300: "#7cd7a0",
          400: "#46bd76",
          500: "#2fa05a",
          600: "#22823f",
          700: "#1d6a35",
          800: "#1a542d",
          900: "#174527",
          950: "#0a2715",
        },
        cream: "#f6f6ea",
        ink: {
          900: "#14201a",
          800: "#1b2b22",
          700: "#26392e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,40,24,.05)",
        pop: "0 8px 24px -12px rgba(16,40,24,.18)",
      },
      maxWidth: { layout: "1200px" },
    },
  },
  plugins: [],
};
