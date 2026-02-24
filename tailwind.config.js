/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        ink: "#0b1f3a",
        navy: "#12325c",
        steel: "#1f4f7a",
        slate: "#546a7b",
        mist: "#e8eef5",
        rag: {
          green: "#1f9d55",
          amber: "#f4b740",
          red: "#d64545"
        }
      },
      boxShadow: {
        panel: "0 18px 40px rgba(9, 24, 44, 0.12)",
        glow: "0 10px 24px rgba(31, 79, 122, 0.25)"
      },
      fontFamily: {
        display: ["Montserrat", "system-ui", "sans-serif"],
        body: ["Source Sans 3", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
