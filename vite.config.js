import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import dsv from "@rollup/plugin-dsv";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { resolve } from "path";

export default defineConfig({
  root: "src/entrypoints",
  base: "/argtools-jp/",
  plugins: [
    preact(),
    dsv(),
    nodePolyfills({
      // @file-type/xml requires some node modules to work
      include: ["stream", "util"],
    }),
  ],
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "src/entrypoints/index.html",
        anything: "src/entrypoints/anything/index.html",
        drwatson: "src/entrypoints/drwatson/index.html",
        tenji: "src/entrypoints/code/tenji/index.html",
      },
    },
  },
});
