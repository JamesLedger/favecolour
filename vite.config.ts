import { defineConfig } from "vite";

export default defineConfig({
  // Configuration options
  root: ".", // The root directory of the project
  base: "/", // Base public path when served in development or production
  server: {
    port: 3000, // Port to run the development server
    open: true, // Open the browser on server start
  },
  build: {
    outDir: "dist", // Directory to output the build files
  },
  plugins: [], // Array of Vite plugins
});
