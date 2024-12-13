import path from "path"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/shopify': {
          target: `https://${env.VITE_SHOPIFY_STORE_URL}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/shopify/, ''),
          secure: false,
          headers: {
            'X-Shopify-Access-Token': env.VITE_SHOPIFY_ACCESS_TOKEN
          }
        }
      }
    }
  }
})