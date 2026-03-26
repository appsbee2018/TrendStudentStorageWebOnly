/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B3F9C",
        tertiary: "#F4872C",
        secondary: "#3768D4",
        background: {
          100: "#F5F5F5",
          200: "#f0f1fa",
          300: "#d8d9e3"
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.5s',
        slideLeft: 'slideLeft 0.75s ease-in'

      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: 'translateY(50px)'},
          "100%": { opacity: 100, transform: 'translateY(5)'}
        },
        slideLeft: {
          "0%": { opacity: 100, transform: 'translateX(100%)'},
          "100%": { opacity: 100, transform: 'translateX(0)'}
        }
      },
      fontFamily: {
        "hind": ["Hind", "serif"],
        "open": ["OpenSans", "sans-serif"],
      },
    },
  },
  plugins: [],
}
