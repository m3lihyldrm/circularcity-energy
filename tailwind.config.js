/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        anthracite: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        wood: {
          100: '#fef3c7',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
        },
        nordicGreen: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        solarYellow: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        aluminum: {
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
        }
      }
    },
  },
  plugins: [],
}
