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
        instagram: {
          primary: '#E4405F',
          secondary: '#833AB4',
          tertiary: '#F56040',
          blue: '#4267B2',
          background: '#FAFAFA',
          border: '#DBDBDB',
          text: '#262626',
          'text-light': '#8E8E8E'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'instagram': '0 2px 4px rgba(0,0,0,0.1)',
        'instagram-hover': '0 4px 8px rgba(0,0,0,0.12)',
      }
    },
  },
  plugins: [],
}
export default config
