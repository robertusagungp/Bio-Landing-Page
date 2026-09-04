/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F4EE',
        foreground: '#172321',
        teal: {
          brand: '#174C45',
          light: '#236159',
          dark: '#0F342F',
        },
        terracotta: {
          DEFAULT: '#D9795F',
          light: '#E5927D',
          dark: '#BD5F46',
        },
        sage: {
          DEFAULT: '#769B82',
          light: '#91B29C',
          dark: '#5C8068',
        },
        mustard: {
          DEFAULT: '#D5A64A',
          light: '#E2BD6D',
          dark: '#B78A33',
        },
        card: '#FFFFFF',
        section: '#EDF1EB',
        border: '#DDDAD2',
        muted: '#6B726E',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Manrope', 'sans-serif'],
      },
      borderRadius: {
        'card': '22px',
        'card-lg': '26px',
        'btn': '16px',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(23, 35, 33, 0.04), 0 1px 3px rgba(23, 35, 33, 0.02)',
        'card': '0 4px 20px rgba(23, 35, 33, 0.06), 0 1px 3px rgba(23, 35, 33, 0.03)',
        'elevated': '0 12px 32px rgba(23, 35, 33, 0.08), 0 2px 6px rgba(23, 35, 33, 0.04)',
      },
      letterSpacing: {
        'tight-heading': '-0.025em',
      }
    },
  },
  plugins: [],
}
