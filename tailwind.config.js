/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAF9',
        foreground: '#0F172A',
        teal: {
          brand: '#0D5C52',
          light: '#137568',
          dark: '#083B34',
        },
        terracotta: {
          DEFAULT: '#E06D53',
          light: '#EB8A74',
          dark: '#B84F38',
        },
        sage: {
          DEFAULT: '#52967A',
          light: '#72B097',
          dark: '#3B735D',
        },
        mustard: {
          DEFAULT: '#D99B26',
          light: '#E5B14E',
          dark: '#B37A12',
        },
        card: '#FFFFFF',
        section: '#F1F5F3',
        border: '#E2E8F0',
        muted: '#64748B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Manrope', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'card-lg': '24px',
        'btn': '14px',
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(13, 92, 82, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card': '0 10px 30px -4px rgba(13, 92, 82, 0.06), 0 2px 8px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 20px 40px -8px rgba(13, 92, 82, 0.12), 0 4px 14px -2px rgba(0, 0, 0, 0.04)',
      },
      letterSpacing: {
        'tight-heading': '-0.025em',
      }
    },
  },
  plugins: [],
}
