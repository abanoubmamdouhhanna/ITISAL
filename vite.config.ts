import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Itisal',
        short_name: 'OrderHub',
        description: 'Order management system for Golden Box',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        id: '/',
        orientation: 'any',
        categories: ['business', 'productivity'],
        icons: [
          {
            src: './Etsal.jpg',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './Etsal.jpg',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: './Etsal.jpg',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ],
        shortcuts: [
          {
            name: 'New Order',
            short_name: 'New Order',
            description: 'Create a new order',
            url: '/new-order',
            icons: [{ src: './Etsal.jpg', sizes: '192x192' }]
          },
          {
            name: 'POS',
            short_name: 'POS',
            description: 'Point of Sale',
            url: '/pos',
            icons: [{ src: '/Etsal.jpg', sizes: '192x192' }]
          }
        ],
        screenshots: [
          {
            src: '/Etsal.jpg',
            sizes: '1200x630',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Itisal Dashboard'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        navigateFallback: 'index.html',
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
