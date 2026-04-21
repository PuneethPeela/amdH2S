import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zesty: {
          orange: '#F97316',
          orangeDark: '#EA580C',
          amber: '#F59E0B',
          emerald: '#10B981',
          teal: '#14B8A6',
          slate: '#1E293B',
          dark: '#0F1117',
          card: 'rgba(255,255,255,0.05)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.45s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'mesh': "radial-gradient(ellipse 80% 50% at 20% -10%, rgba(249,115,22,0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(16,185,129,0.1), transparent)",
      },
      boxShadow: {
        'glow-orange': '0 0 24px rgba(249,115,22,0.35)',
        'glow-green': '0 0 24px rgba(16,185,129,0.35)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};
export default config;
