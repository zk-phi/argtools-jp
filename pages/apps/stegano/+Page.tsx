import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { steganoAnalyzer } from "../../../src/modules/analyzers/image/steganoAnalyzer";

export const Page = microAppFactory({
  importerLabel: "解析したい画像ファイル",
  outputLabel: "解析結果",
  importer: fileImporter,
  analyzer: steganoAnalyzer,
});
