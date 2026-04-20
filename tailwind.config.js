/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: { ink: "#1E2820", soft: "#F2F8F5", brand: "#2D5246", sage: "#D1E4DD" },
      boxShadow: { float: "0 18px 40px rgba(17, 24, 39, 0.12)" },
      fontFamily: { playwrite: ['"Noto Sans JP"', "ui-sans-serif", "system-ui", "sans-serif"] },
    },
  },
};
