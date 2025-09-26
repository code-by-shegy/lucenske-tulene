import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Lučenské Tulene',
        short_name: 'Tulene',
        description: 'Cold exposure & hardening app 🦭❄️',
        theme_color: '#0ea5e9',
        icons: [
          {
            src: '/lucenske_tulene_logo_blue_background_192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/lucenske_tulene_logo_blue_background_512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
