import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { steganoAnalyzer } from "../../../src/modules/analyzers/image/steganoAnalyzer";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "解析したい画像ファイル" },
    { module: steganoAnalyzer },
  ],
  outputLabel: "解析結果",
});
