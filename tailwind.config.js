/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#EC4899',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      fontFamily: {
        heading: ['Bebas Neue', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'morph': 'morph 3s ease-in-out infinite',
        'particle': 'particle 1s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-out': 'fadeOut 0.5s ease-out forwards',
        'pulse-hint': 'pulseHint 2s ease-in-out infinite'
      },
keyframes: {
        glow: {
          'from': { 'box-shadow': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
          'to': { 'box-shadow': '0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor' }
        },
        morph: {
          '0%, 100%': { 'border-radius': '30% 70% 70% 30% / 30% 30% 70% 70%' },
          '50%': { 'border-radius': '70% 30% 30% 70% / 70% 70% 30% 30%' }
        },
        particle: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(180deg)', opacity: '0' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' }
        },
        pulseHint: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}