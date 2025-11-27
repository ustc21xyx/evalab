import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 温暖的米色/奶油色主题
        cream: {
          50: '#FDFCFB',
          100: '#FAF6F1',
          200: '#F5EDE3',
          300: '#EDE0D0',
          400: '#E0CEBD',
          500: '#D4BDAA',
        },
        // 柔和的棕色
        warm: {
          50: '#F9F5F2',
          100: '#EDE4DC',
          200: '#D9C9BA',
          300: '#C5AE98',
          400: '#A8917A',
          500: '#8B7355',
          600: '#6B5A45',
          700: '#4D4235',
          800: '#352E26',
          900: '#1F1B17',
        },
        // 点缀色
        accent: {
          green: '#6B8E6B',
          gold: '#B8860B',
          slate: '#708090',
          terracotta: '#CD853F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(139, 115, 85, 0.08)',
        'soft-md': '0 4px 12px rgba(139, 115, 85, 0.1)',
      }
    },
  },
  plugins: [],
}
export default config
