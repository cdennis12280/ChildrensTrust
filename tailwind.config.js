/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        ink: "#0a1b2e",
        navy: "#0f2a47",
        steel: "#1a3a5f",
        slate: "#6a7a8c",
        mist: "#d9e4f2",
        carbon: "#08121f",
        obsidian: "#050b14",
        mint: "#7de3c1",
        gold: "#f5c36a",
        aqua: "#6ec7ff",
        rag: {
          green: "#2ecc71",
          amber: "#f4b740",
          red: "#e24a4a"
        }
      },
      boxShadow: {
        panel: "0 24px 60px rgba(3, 10, 20, 0.35)",
        glow: "0 16px 40px rgba(20, 80, 160, 0.35)"
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["Manrope", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
