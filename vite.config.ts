import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // add this to cache all the imports
      workbox: {
        globPatterns: ["**/*"], // Files matching any of these patterns will be included in the precache manifest.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.href.includes("/api/Items");
            },
            method: "GET",
            handler: "CacheFirst" as const, // Prefer making API request. If not possible (e.g. no network connection), fall back to cache.
            options: {
              cacheName: "api-cache",
              cacheableResponse: {
                statuses: [0, 200], // 0 = opaque responses, as defined in the Fetch API.
              },
              // networkTimeoutSeconds: 10, // Keep the timeout this high! Otherwise, workbox might be unable to respond with the cached version fast enough.
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
      // add this to cache all the
      // static assets in the public folder
      includeAssets: ["**/*"],
      registerType: "prompt",
      manifest: {
        theme_color: "#f69435",
        background_color: "#f69435",
        display: "standalone",
        scope: "/",
        start_url: "/",
        short_name: "vite test",
        description: "testing vite pwa",
        name: "vite test",
        orientation: "portrait",
        icons: [
          {
            src: "maskable_icon.png",
            type: "image/png",
            sizes: "192x192",
            purpose: "any maskable",
          },
          {
            src: "logo192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "logo256.png",
            type: "image/png",
            sizes: "256x256",
          },
          {
            src: "logo384.png",
            type: "image/png",
            sizes: "384x384",
          },
          {
            src: "logo512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
      },
    }),
  ],
});
