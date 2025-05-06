import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import vike from "vike/plugin";
import dsv from "@rollup/plugin-dsv";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  base: "/argtools-jp/",
  plugins: [
    preact(),
    dsv(),
    nodePolyfills({
      // @file-type/xml requires some node modules to work
      include: ["stream", "util"],
    }),
    vike(),
  ],
});
