import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { exifExtractor } from "../../../src/modules/analyzers/image/exifExtractor";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "調べたい画像ファイル" },
    { module: exifExtractor },
  ],
  outputLabel: "抽出結果",
});
