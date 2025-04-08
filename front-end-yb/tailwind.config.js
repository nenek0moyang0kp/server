/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pragati: ["Pragati Narrow", "sans-serif"],
        spartan: ["League Spartan", "sans-serif"],
        fustat: ["Fustat", "sans-serif"],
        potta: ["Potta One", "cursive"],
        raleway: ["Raleway", "sans-serif"],
        henny: ["Henny Penny", "cursive"],
      },
      colors: {
        primary: "#639F4E",
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
    },
  },
  plugins: [],
}

