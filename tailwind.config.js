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
        // FollowYourBaby brand palette
        brand: {
          pink:     '#FF8FA8', // Primary — soft pink
          lavender: '#B79CFF', // AI / Highlight
          peach:    '#FFF3EC', // Background
          blue:     '#A9D6FF', // Baby tracking
          mint:     '#AEE6C8', // Success
          gray:     '#F7F7F7', // Cards
          navy:     '#1F2B5B', // Text
        },
        // Tonal scales derived from brand primaries
        'brand-pink': {
          50:  '#FFF0F3',
          100: '#FFD9E3',
          200: '#FFBDCE',
          300: '#FF9FBA',
          400: '#FF8FA8', // base
          500: '#FF6B8A',
          600: '#E84E70',
          700: '#C73558',
          800: '#A01E42',
          900: '#7A0D2E',
        },
        'brand-lavender': {
          50:  '#F4F0FF',
          100: '#E5DAFF',
          200: '#CFC1FF',
          300: '#BCA5FF',
          400: '#B79CFF', // base
          500: '#9B7AEF',
          600: '#7C5CDB',
          700: '#5E41C0',
          800: '#432DA0',
          900: '#2E1E80',
        },
        // Kept for backward-compat
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
      borderRadius: {
        // Design system tokens
        'card':   '24px', // Card
        'btn':    '18px', // Button
        'input':  '16px', // Input
        'modal':  '28px', // Modal
      },
      fontFamily: {
        // Nunito via expo-font; falls back to system rounded font
        sans:    ['Nunito', 'System'],
        display: ['Nunito', 'System'],
      },
      boxShadow: {
        'brand': '0 8px 24px rgba(0,0,0,0.08)',
        'brand-lg': '0 12px 32px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
};
