// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Replace with your GitHub repo name
const repoName = "chat";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: `/${repoName}/`,
});
