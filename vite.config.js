import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "./docs/dev",
    //emptyOutDir: true,
    sourcemap: true,
    // Minify set to true will break the IIFE output
    minify: false,

    // This makes build file names look nice. (and trackable in github)
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
