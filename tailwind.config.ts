import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode tokens
        dark: {
          bg: '#1A1410',
          surface: '#241C16',
          elevated: '#2E2318',
          border: '#3D3028',
          text: '#F0EDE8',
          muted: '#A89880',
        },
        // Light mode tokens
        light: {
          bg: '#F5F4EF',
          text: '#1C1C1A',
        },
        // Shared
        sage: '#7A9E82',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'mobile-sheet': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [],
}
export default config
