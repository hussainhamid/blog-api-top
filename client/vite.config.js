import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    outDir: "dist",
  },

  server: {
    proxy: {
      "/me": "http://localhost:3000",
      "/article": "http://localhost:3000",
      "/save-article": "http://localhost:3000",
      "/get-articles": "http://localhost:3000",
      "/become-writer": "http://localhost:3000",
      "/profile": "http://localhost:3000",
      "/see-profile-article": "http://localhost:3000",
      "/delete-article": "http://localhost:3000",
      "/publish-article": "http://localhost:3000",
      "/unPublish-article": "http://localhost:3000",
      "/see-profile-comments": "http://localhost:3000",
      "/delete-comment": "http://localhost:3000",
      "/see-article": "http://localhost:3000",
      "/create-comment": "http://localhost:3000",
      "/sign-up": "http://localhost:3000",
      "/log-in": "http://localhost:3000",
      "/log-out": "http://localhost:3000",
    },
  },
});
