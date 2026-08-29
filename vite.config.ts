import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

function copySw() {
  return {
    name: "copy-sw",
    closeBundle() {
      try {
        const srcDir = "dist";
        const destDir = "build/client";
        if (!existsSync(srcDir) || !existsSync(destDir)) return;
        for (const f of readdirSync(srcDir)) {
          if (f.startsWith("sw") || f.startsWith("workbox")) {
            copyFileSync(join(srcDir, f), join(destDir, f));
          }
        }
      } catch {}
    },
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "logo.png", "images/**/*"],
      manifest: {
        name: "BANBUENG SMART",
        short_name: "BANBUENG",
        description: "เชื่อมโยงบริการเป็นหนึ่งเดียว เพื่อชาวบ้านบึง",
        theme_color: "#0a0a54",
        background_color: "#F7F8FC",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/logo.png", sizes: "192x192", type: "image/png" },
          { src: "/logo.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        globDirectory: "build/client",
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,svg,woff2,webmanifest}"],
        navigateFallback: "index.html",
        navigateFallbackAllowlist: [/^\/$/],
        runtimeCaching: [
          { urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i, handler: "CacheFirst", options: { cacheName: "jsdelivr", expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 } } },
          { urlPattern: /^https:\/\/picsum\.photos\/.*/i, handler: "CacheFirst", options: { cacheName: "picsum", expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 } } },
          { urlPattern: ({ request }: any) => request.mode === "navigate", handler: "NetworkFirst", options: { cacheName: "pages", networkTimeoutSeconds: 3, expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 } } },
        ],
      },
      devOptions: { enabled: false },
    }),
    copySw(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
