import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import dsv from "@rollup/plugin-dsv";
import { resolve } from "path";

export default defineConfig({
  root: "src/entrypoints",
  base: "/argtools-jp/",
  plugins: [preact(), dsv()],
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "src/entrypoints/index.html",
        anything: "src/entrypoints/anything/index.html",
        aa: "src/entrypoints/text/aa/index.html",
      },
    },
  },
});
