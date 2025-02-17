import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

// @ts-check
import { defineConfig } from "astro/config";

import tsconfigPaths from "vite-tsconfig-paths";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), tailwind({ applyBaseStyles: false })],
  vite: {
    // using the tsconfig-paths vite plugin to resolve paths in tsconfig.json
    plugins: [tsconfigPaths()],
  },
  outDir: "../../target-frontend/web",
  devToolbar: { enabled: false },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
});
