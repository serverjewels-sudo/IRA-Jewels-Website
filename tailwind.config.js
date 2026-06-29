/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'ira-white': '#FFFFFF',
        'ira-gold': '#CDB38B',
        'ira-graphite': '#2E3135',
        'ira-mist': '#F3F1EC',
      },
    },
  },
  plugins: [],
};
