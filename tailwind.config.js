/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#0F1115',
          secondary: '#15181D',
          surface: '#191D23',
          elevated: '#1E232A',
          hover: '#242A33',
          border: '#2A3038',
          borderSubtle: '#22272F',
        },
        text: {
          primary: '#F4F6F8',
          secondary: '#A7AFBA',
          muted: '#737C88',
        },
        brand: {
          blue: '#3B82F6',
          blueHover: '#2563EB',
          blueSubtle: 'rgba(59, 130, 246, 0.1)',
        },
        semantic: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        btn: '8px',
        modal: '14px',
        badge: '6px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.15)',
        elevated: '0 8px 24px rgba(0, 0, 0, 0.35)',
      },
      transitionDuration: {
        DEFAULT: '180ms',
      }
    },
  },
  plugins: [],
}
