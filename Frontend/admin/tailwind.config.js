/** @type {import('tailwindcss').Config} */
export default {
  // content: [
  //   "./src/**/*.{js,jsx,ts,tsx}",
  // ],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        darkGrey: '#1c1c1c',
        emeraldGreen: '#2ecc71',
        charcoal: '#333333',
        oliveGreen: '#3d9970',
        teal: '#008080',
        deepBlue: '#0e4d92',
        burntOrange: '#ff7043',
        steelBlue: '#4682b4',
        maroon: '#800000',
        lightGrey: '#d3d3d3',
      },
    },
  },
  plugins: [],
}

