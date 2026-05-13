/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Pastel palette for maternal / baby care
        rose: {
          50:  '#fff5f7',
          100: '#ffe4ea',
          200: '#ffc2cf',
          300: '#ff9db4',
          400: '#ff7096',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        mint: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        cream: {
          50:  '#fffdf7',
          100: '#fef9ec',
          200: '#fdf0c8',
          300: '#fbe5a0',
          400: '#f8d26e',
          500: '#f4bb3a',
          600: '#d9970f',
          700: '#b47a0c',
          800: '#905e10',
          900: '#764d12',
        },
        'soft-blue': {
          50:  '#eff8ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
