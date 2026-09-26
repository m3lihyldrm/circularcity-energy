/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        surface: 'var(--surface)',
        'surface-muted': 'var(--surface-muted)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        border: 'var(--border)',
        forest: {
          DEFAULT: 'var(--forest)',
          dark: 'var(--forest-dark)',
          soft: 'var(--forest-soft)',
        },
        sun: {
          DEFAULT: 'var(--sun)',
          soft: 'var(--sun-soft)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          soft: 'var(--warning-soft)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          soft: 'var(--danger-soft)',
        },
        info: {
          DEFAULT: 'var(--info)',
          soft: 'var(--info-soft)',
        }
      },
      borderRadius: {
        'button': '8px',
        'card': '12px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(24, 32, 25, 0.05), 0 1px 2px -1px rgba(24, 32, 25, 0.03)',
        'elevated': '0 4px 14px -2px rgba(24, 32, 25, 0.07), 0 2px 6px -1px rgba(24, 32, 25, 0.04)',
      }
    },
  },
  plugins: [],
}
