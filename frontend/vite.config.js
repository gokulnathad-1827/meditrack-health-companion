import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Required for Capacitor: makes all asset paths relative so they work
  // on Android's file:// protocol inside WebView
  base: "./",
});
