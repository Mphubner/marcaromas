/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Monitora todos os arquivos na pasta src
  ],
  theme: {
    extend: {
      // Adicionando as cores da sua marca
      colors: {
        'brand-primary': '#8B7355',
        'brand-primary-hover': '#6B5845', // Tom mais escuro para hover
        'brand-dark': '#2C2419',
        'brand-accent': '#D4A574',
        'brand-light': '#FAFAF9',
        'brand-light-alt': '#F9F8F6',
      },
      // Definindo a fonte padrão
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Usando a fonte Inter
      },
    },
  },
  plugins: [],
}