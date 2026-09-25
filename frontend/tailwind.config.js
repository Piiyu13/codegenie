/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        genie: {
          off: '#EDF7F6',
          blue: '#168DF5',
          navy: '#173B63',
          white: '#FFFFFF',
          light: '#F1F5F9',
        },
        brand: {
          50: '#EBF6FE',
          100: '#D4ECFD',
          200: '#A9D9FB',
          300: '#73C0F8',
          400: '#3AA3F6',
          500: '#168DF5',
          600: '#0A72D4',
          700: '#0B5DAB',
          800: '#0E4D8C',
          900: '#123F72',
        },
        ink: {
          50: '#F6F8FA',
          100: '#EEF2F6',
          200: '#DDE5EC',
          300: '#C2CFDB',
          400: '#93A4B7',
          500: '#6B7F96',
          600: '#4E617A',
          700: '#3A4B61',
          800: '#26374D',
          900: '#173B63',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: [
          'Plus Jakarta Sans',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(23, 59, 99, 0.04), 0 8px 24px rgba(23, 59, 99, 0.06)',
        card: '0 1px 3px rgba(23, 59, 99, 0.06), 0 10px 30px rgba(23, 59, 99, 0.07)',
        lift: '0 12px 34px rgba(23, 59, 99, 0.14)',
        glow: '0 10px 30px rgba(22, 141, 245, 0.28)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.7)', opacity: '0' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'slide-in-right': 'slide-in-right 0.35s ease-out both',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.2, 0.6, 0.4, 1) infinite',
        'bounce-slow': 'bounce-slow 3.5s ease-in-out infinite',
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};
