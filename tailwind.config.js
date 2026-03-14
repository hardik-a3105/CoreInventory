/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
      },
      colors: {
        primary:  '#6D28D9',
        'primary-dark': '#5B21B6',
        'primary-light': '#EDE9FF',
        'primary-mid':  '#DDD5FF',
        navy:   '#1E1B4B',
        muted:  '#6B7280',
        hint:   '#9CA3AF',
        bg:     '#F5F3FF',
        surface:'#FFFFFF',
      },
    },
  },
  plugins: [],
}
