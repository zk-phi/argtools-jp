import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { spectrogramRenderer } from "../../../src/modules/analyzers/audio/spectrogramRenderer";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "解析したい音声ファイル" },
    { module: spectrogramRenderer },
  ],
  outputLabel: "解析結果",
});
