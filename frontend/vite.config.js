import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load all env vars based on the current mode (dev/prod)
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:5001'),
      'import.meta.env.VITE_FRONTEND_URL': JSON.stringify(env.VITE_FRONTEND_URL || 'http://localhost:5173'),
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID || '168078416745-nf9emaej1i4m0cv9eqj3tuac8i1u0juk.apps.googleusercontent.com'),
      'import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY': JSON.stringify(env.VITE_MERCADOPAGO_PUBLIC_KEY || ''),
      'import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY_TRANSPARENT': JSON.stringify(env.VITE_MERCADOPAGO_PUBLIC_KEY_TRANSPARENT || env.VITE_MERCADOPAGO_PUBLIC_KEY || ''),
    },
    
    build: {
      target: 'es2020'
    },
    optimizeDeps: {
      include: ['react-dom/client']
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})