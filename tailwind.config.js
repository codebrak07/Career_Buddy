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
        obsidian: {
          950: '#0B0D10',
          900: '#121418',
          850: '#171A20',
          800: '#1E222A',
          700: '#2A303C',
          600: '#3D4556',
        },
        ivory: {
          50: '#FAF9F5',
          100: '#F4F3EE',
          200: '#E8E6DD',
          300: '#D5D2C5',
          400: '#ABA695',
        },
        ink: {
          primary: '#F4F3EE',
          secondary: '#A2A9B8',
          muted: '#687284',
          ghost: '#3A4250',
          dark: '#121418',
        },
        accent: {
          flame: '#FF6B35',
          flameHover: '#E85924',
          amber: '#F59E0B',
          cyan: '#00C2CB',
          emerald: '#10B981',
          rose: '#F43F5E',
          indigo: '#6366F1',
        },
        instrument: {
          border: 'rgba(255, 255, 255, 0.08)',
          borderStrong: 'rgba(255, 255, 255, 0.16)',
          surface: 'rgba(26, 30, 38, 0.85)',
          surfaceElevated: 'rgba(34, 40, 52, 0.95)',
          gridLine: 'rgba(255, 255, 255, 0.03)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'Geist Mono', 'monospace'],
        editorial: ['Editorial New', 'Canela', 'Tiempos Headline', 'Georgia', 'serif'],
      },
      boxShadow: {
        'instrument-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'instrument-md': '0 4px 12px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'instrument-lg': '0 12px 32px 0 rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
        'dossier-stamp': '0 2px 4px rgba(0,0,0,0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'telemetry-blink': 'telemetryBlink 1.2s step-end infinite',
      },
      keyframes: {
        telemetryBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        }
      }
    },
  },
  plugins: [],
}
