/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#4F46E5', light: '#6366F1', dark: '#4338CA' },
        secondary: { DEFAULT: '#10B981', light: '#34D399', dark: '#059669' },
        neutral: { 
          50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 
          500: '#6B7280', 700: '#374151', 800: '#1F2937', 900: '#111827' 
        }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: { 'fade-in': 'fadeIn 0.3s ease-in-out', 'slide-up': 'slideUp 0.4s ease-out' },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } }
      }
    },
  },
  plugins: [],
}
