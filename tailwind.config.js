export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:    '#4A4A4A',
          DEFAULT: '#6D8196',
          light:   '#CBCBCB',
          pale:    '#FFFFE3',
        },
        amazon: {
          header:           '#131921',
          subheader:        '#232F3E',
          accent:           '#FF9900',
          'accent-hover':   '#E88A00',
          bg:               '#FFFFFF',
          section:          '#F3F3F3',
          border:           '#DDDDDD',
          price:            '#B12704',
          text:             '#0F1111',
          'text-secondary': '#565959',
        },
      }
    },
  },
  plugins: [],
}
