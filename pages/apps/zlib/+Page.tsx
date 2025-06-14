import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { zlibDecompressor } from "../../../src/modules/analyzers/binary/zlibDecompressor";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "zlib 圧縮されたデータ" },
    { module: zlibDecompressor },
  ],
  outputLabel: "伸張結果",
});
