/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff7f9',
          100: '#ffeef2',
          200: '#ffdce5',
          300: '#fcc2d0',
          400: '#f7a1b8',
          500: '#ea7d9b',
        },
        dusty: {
          100: '#f3e6e7',
          200: '#e8d0d3',
          300: '#d6b3b8',
          400: '#bf939a',
          500: '#a3747d',
          600: '#845a63',
          700: '#6b4750',
        },
        cream: {
          50: '#fffdf8',
          100: '#fdf6ec',
          200: '#f8ecd9',
        },
        cherry: {
          300: '#e8607d',
          400: '#d13a5f',
          500: '#b5173f',
          600: '#9a1234',
          700: '#7d0e2a',
        },
        ink: {
          600: '#6f5a60',
          800: '#4a3238',
          900: '#3a2a2f',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Jost', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'float-up': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.85' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-115vh) rotate(30deg)', opacity: '0' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(0.7)' },
          '50%': { opacity: '1', transform: 'scale(1.25)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.12)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.08)' },
          '56%': { transform: 'scale(1)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(60px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-4deg)' },
          '75%': { transform: 'rotate(4deg)' },
        },
        'gift-shake': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(-6deg)' },
          '40%': { transform: 'rotate(6deg)' },
          '60%': { transform: 'rotate(-4deg)' },
          '80%': { transform: 'rotate(4deg)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translate(0, 0) scale(0.6)' },
          '20%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translate(var(--dx, 0px), -90px) scale(1.2)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'float-up': 'float-up linear infinite',
        twinkle: 'twinkle ease-in-out infinite',
        heartbeat: 'heartbeat 1.8s ease-in-out infinite',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        'scale-in': 'scale-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-up': 'slide-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        wiggle: 'wiggle 0.5s ease-in-out',
        'gift-shake': 'gift-shake 0.6s ease-in-out',
        rise: 'rise 1.4s ease-out forwards',
        'spin-slow': 'spin-slow 14s linear infinite',
      },
    },
  },
  plugins: [],
};
