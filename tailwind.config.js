module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx,vue}', './index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        '1/1': '100%',
      },
      borderWidth: {
        6: '6px',
      },
    },
    container: {
      center: true,
    },
    // screens: {
    //   sm: { max: '576px' },
    // },
  },
  variants: {
    extend: {
      borderWidth: ['first', 'last'],
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
