import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from '../node_modules/dotenv'
import { host, port } from '../config/default.json'

const PORT = port === 80 ? '' : ':' + port

dotenv.config({ path: `../.env` })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'xmlhttprequest-ssl': './node_modules/engine.io-client/lib/xmlhttprequest.js',
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.vue', '.tsx', '.ts', '.mjs', '.js', '.jsx', '.json', '.wasm']
  },
  define: {
    'process.env': {
      host: process.env.host || (host + PORT)
    }
  }
})