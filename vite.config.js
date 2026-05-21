import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // ✅ Import the Tailwind Vite plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(), // ✅ Add the plugin here
  ],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "react-router",
            "react-router-dom",
            "@apollo/client",
            "graphql",
            "html2pdf.js",
            "lucide-react",
            "tailwindcss",
          ],
        },
      },
    },
  },
});
