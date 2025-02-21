
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#1A1A1A',
          foreground: '#F5F5F5'
        },
        secondary: {
          DEFAULT: '#F5F5F5',
          foreground: '#1A1A1A'
        },
        accent: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF'
        }
      },
      fontFamily: {
        'alegreya': ['Alegreya', 'serif'],
        'labrada': ['Labrada', 'serif']
      },
      keyframes: {
        'pulse-dot': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.4' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
