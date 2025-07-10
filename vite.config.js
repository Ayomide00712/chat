// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Replace with your GitHub repo name
const repoName = "chat";

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
});
