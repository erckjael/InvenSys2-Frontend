/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta corporativa InvenSys2
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d7fe',
          300: '#a5bbfc',
          400: '#8098f9',
          500: '#6172f3',
          600: '#444ce7',   // ← color principal
          700: '#3538cd',
          800: '#2d31a6',
          900: '#2d3282',
          950: '#1f2064',
        },
        slate: {
          850: '#1a2235',
          900: '#111827',
          950: '#0d1424',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    // Plugin de forms para estilos base de inputs
    // ya instalado con @tailwindcss/forms
  ],
}
