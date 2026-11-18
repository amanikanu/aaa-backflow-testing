/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#38a5f8',
          500: '#0e87ea',
          600: '#026bc7',
          700: '#0356a1',
          800: '#074984',
          900: '#0b3d6f',
          950: '#082749',
        },
        trade: {
          navy: '#0d2b45',
          dark: '#081a2b',
          blue: '#155eef',
          'blue-hover': '#1048be',
          red: '#c81e1e',
          'red-hover': '#a81616',
          accent: '#c81e1e',
          slate: '#f8fafc',
          border: '#e2e8f0',
        },
        cta: {
          DEFAULT: '#c81e1e',
          fg: '#ffffff',
          hover: '#a81616',
        },
        flow: '#155eef',
        ink: '#0b1d33',
        muted: '#52657a',
        surface: '#ffffff',
        line: '#e2e8f0',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
      },
      maxWidth: {
        content: '76rem',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(13, 43, 69, 0.08)',
        elevated: '0 20px 40px -15px rgba(13, 43, 69, 0.16)',
        red: '0 8px 24px -6px rgba(200, 30, 30, 0.45)',
        blue: '0 8px 24px -6px rgba(21, 94, 239, 0.35)',
      },
    },
  },
  plugins: [],
};
