/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        c100:    '#E4E4E5',
        c200:    '#BEBEBE',
        c300:    '#949494',
        c400:    '#7A7A7A',
        c500:    '#545454',
        c600:    '#3C3C3C',
        paper:   '#FAFAFA',
        surface: '#FFFFFF',
        ink:     '#1A1A1A',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};
