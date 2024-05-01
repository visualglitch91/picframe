import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { createHtmlPlugin } from "vite-plugin-html";
import react from "@vitejs/plugin-react";

const baseUrl = "/";

export default defineConfig({
  base: baseUrl,
  server: {
    host: "0.0.0.0",
  },
  build: {
    outDir: `${__dirname}/dist`,
  },
  plugins: [
    react(),

    createHtmlPlugin({
      minify: true,
      inject: { data: { baseUrl } },
    }),

    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,svg,woff2}"],
        globIgnores: ["latest.json"],
      },
      includeAssets: [
        "icons/16x16.png",
        "icons/48x48.png",
        "icons/192x192.png",
        "icons/512x512.png",
        "icons/512x512-maskable.png",
      ],
      manifest: {
        name: "PicFrame",
        short_name: "PicFrame",
        description: "An app to frame my pictures",
        scope: baseUrl,
        start_url: `${baseUrl}index.html`,
        theme_color: "#282a36",
        background_color: "#282a36",
        icons: [
          {
            src: "icons/192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
