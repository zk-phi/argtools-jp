import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { binaryToImage } from "../../../src/modules/analyzers/binary/binaryToImage";

export const Page = microAppFactory({
  importerLabel: "可視化したいファイル",
  outputLabel: "出力画像",
  importer: fileImporter,
  analyzer: binaryToImage,
});
