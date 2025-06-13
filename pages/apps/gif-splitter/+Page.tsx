import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { gifSplitter } from "../../../src/modules/analyzers/image/gifSplitter";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "分解したい GIF アニメ" },
    { module: gifSplitter },
  ],
  outputLabel: "抽出結果",
});
