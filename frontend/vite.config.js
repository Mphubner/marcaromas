import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// NÃO SÃO MAIS NECESSÁRIOS OS IMPORTS DE 'path' e 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // A SEÇÃO 'resolve' FOI REMOVIDA
  
  build: {
    target: 'es2020'
  },
  optimizeDeps: {
    include: ['react-dom/client']
  }
})