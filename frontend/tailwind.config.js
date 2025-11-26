module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#44403c',
          700: '#292524',
          800: '#1c1917',
          900: '#0f0d0c',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        cream: {
          50: '#fdfcfa',
          100: '#faf8f5',
          200: '#f5f1ea',
          300: '#ebe4d8',
          400: '#d9cdb9',
        }
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(28,100%,74%,0.15) 0, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.05) 0, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.05) 0, transparent 50%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(245, 158, 11, 0.15)',
        'glow-lg': '0 0 40px rgba(245, 158, 11, 0.25)',
      }
    },
  },
  plugins: [],
}
