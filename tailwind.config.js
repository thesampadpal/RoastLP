/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          orange: "#ff6b35",
          pink: "#ff0080",
          yellow: "#ffd600",
        },
        dark: {
          900: "#0a0a0a",
          800: "#141414",
          700: "#1a1a1a",
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(255, 107, 53, 0.5)",
        "neon-strong": "0 0 40px rgba(255, 107, 53, 0.8)",
        "neon-pink": "0 0 20px rgba(255, 0, 128, 0.5)",
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        flame: "flame 0.5s ease-in-out infinite alternate",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 107, 53, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 107, 53, 0.8)" },
        },
        flame: {
          "0%": { transform: "scale(1) rotate(-2deg)" },
          "100%": { transform: "scale(1.1) rotate(2deg)" },
        },
      },
    },
  },
  plugins: [],
};
