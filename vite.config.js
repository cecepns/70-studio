import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo/1.png', 'logo/2.png', 'fonts/*'],
      manifest: {
        name: '70 Studio - Professional Photography Studio Jakarta',
        short_name: '70 Studio',
        description: 'Studio foto profesional di Duren Sawit, Jakarta Timur. Melayani Prewedding, Family, Graduation, Group, Maternity, Model, Personal, dan Birthday photoshoot.',
        theme_color: '#995433',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/logo/1.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo/1.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg,woff,woff2,ttf,otf}'],
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^\/(?!api\/).*$/]
      }
    })
  ],
  server: {
    port: 5173,
    host: true
  }
});
