/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Relative to frontend folder
    './public/index.html', // Relative to frontend folder
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'blue-gray': {
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        'accent-blue': '#3b82f6',
      },
      spacing: {
        '72': '18rem',
        '96': '24rem',
      },
      width: {
        'sidebar': '16rem',
      },
    },
  },
  plugins: [],
};