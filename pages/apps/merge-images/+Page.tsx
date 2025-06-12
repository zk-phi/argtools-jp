import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { imageMerger } from "../../../src/modules/analyzers/image/imageMerger";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "１枚目の画像" },
    { module: fileImporter, label: "２枚目の画像" },
    { module: imageMerger },
  ],
  outputLabel: "合成された画像",
});
