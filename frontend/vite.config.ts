import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'models/**/*', 'audios/**/*'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,glb,mp3,json}'],
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50MB for GLB models
        runtimeCaching: [
          {
            urlPattern: /\.(?:glb|gltf)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: '3d-models',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: /\.(?:mp3|wav)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-files',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
      manifest: {
        name: 'AetherLearn',
        short_name: 'AetherLearn',
        description: 'AI-powered 3D classroom for offline education',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
