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
        globPatterns: ["**/*"],
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
