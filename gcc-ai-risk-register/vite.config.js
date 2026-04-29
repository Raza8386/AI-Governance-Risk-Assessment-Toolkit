import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['xlsx']
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':  ['react', 'react-dom'],
          'charts':        ['recharts'],
          'pdf-export':    ['jspdf', 'jspdf-autotable'],
          'excel-export':  ['xlsx'],
        }
      }
    }
  }
})
