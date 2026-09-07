/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
      },
      colors: {
        canvas: {
          DEFAULT: "#08090d",
          soft: "#0e1017",
        },
        surface: {
          DEFAULT: "#14161f",
          raised: "#1a1d29",
          border: "#262a3a",
        },
        brand: {
          50: "#eefbf3",
          100: "#d5f5e1",
          200: "#a9eac6",
          300: "#73d9a7",
          400: "#3fc186",
          500: "#1fa66d",
          600: "#0f8a5a",
          700: "#0c6f4a",
          800: "#0b583c",
          900: "#0a4832",
          glow: "#4ee6a3",
        },
        accent: {
          DEFAULT: "#7c8cff",
          soft: "#c2c9ff",
        },
        warn: "#f5b942",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(78,230,163,0.15), 0 8px 30px -6px rgba(78,230,163,0.25)",
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 30px -14px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% -10%, rgba(78,230,163,0.14), transparent 45%), radial-gradient(circle at 100% 0%, rgba(124,140,255,0.12), transparent 40%)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "pop": {
          "0%": { opacity: 0, transform: "scale(0.96)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "pulse-dot": {
          "0%, 80%, 100%": { opacity: 0.25, transform: "scale(0.8)" },
          "40%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease both",
        "pop": "pop 0.2s ease both",
        "pulse-dot": "pulse-dot 1.4s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
