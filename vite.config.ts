import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node18",
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
    outDir: "dist",
    rollupOptions: {
      external: isExternal,
    },
  },
});

function isExternal(id: string) {
  return !id.startsWith(".") && !path.isAbsolute(id);
}
