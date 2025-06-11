import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { binaryToImage } from "../../../src/modules/analyzers/binary/binaryToImage";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "可視化したいファイル" },
    { module: binaryToImage },
  ],
  outputLabel: "出力画像",
});
