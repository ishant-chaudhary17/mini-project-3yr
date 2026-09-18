/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // We will manage dark mode manually with a class on html
  theme: {
    extend: {
      colors: {
        ink: {
          900: 'var(--ink-900)',
          800: 'var(--ink-800)',
          700: 'var(--ink-700)',
        },
        line: 'var(--line)',
        'text-hi': 'var(--text-hi)',
        'text-lo': 'var(--text-lo)',
        signal: 'var(--signal)',
        actor: 'var(--actor)',
        'depth-2': 'var(--depth-2)',
        'depth-3': 'var(--depth-3)',
        idle: 'var(--idle)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
