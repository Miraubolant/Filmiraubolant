/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#737b24',
          dark: '#5c6319',
          light: '#a5af35',
        },
        dark: {
          DEFAULT: '#0f1117',
          lighter: '#1a1c24',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      screens: {
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px', // Pour les écrans 4K
      },
    },
  },
  plugins: [],
  // Désactiver les styles de focus par défaut
  corePlugins: {
    ringOpacity: false,
    ringColor: false,
    ringOffsetWidth: false,
    ringOffsetColor: false,
    ring: false,
  }
};