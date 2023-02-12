/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "japanese-house": "url('/LANDAGEHOUSE2.jpg')",
        "japanese-houseSM": "url('/landPageSM.png')",
        "japanese-houseMD": "url('/landPageMD.png')",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
