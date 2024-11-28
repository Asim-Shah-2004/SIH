/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './navigation/**/*.{js,jsx,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // light:{

        //   primary: '#F05454',
        //   secondary: '#CBD77E',
        //   dark: '#282828',
        //   background: '#DDDDDD',
        // },
        // // primary: '#A7A0D3',
        // primary: '#F05454',
        // secondary: '#CBD77E',
        // dark: '#282828',
        // background: '#DDDDDD',
        primary: '#2C3E8D',       // Deep blue
        secondary: '#3498DB',     // Bright blue
        background: '#F5F7FA',    // Light gray-blue
        text: '#2C3F4A',          // Dark navy gray
        accent: '#ECF0F1',        // Soft gray
        highlight: '#34495E'       // Slate blue
        
      }
    },
  },
  plugins: [],
};
