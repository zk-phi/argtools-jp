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
        drwatson: "src/entrypoints/drwatson/index.html",
        aa: "src/entrypoints/code/aa/index.html",
        tenji: "src/entrypoints/code/tenji/index.html",
        rgbextract: "src/entrypoints/image/rgbextract/index.html",
        metaextract: "src/entrypoints/image/metaextract/index.html",
        whoru: "src/entrypoints/file/whoru/index.html",
      },
    },
  },
});
