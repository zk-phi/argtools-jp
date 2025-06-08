import { microAppFactory } from "../../../src/microAppFactory";
import { textImporter } from "../../../src/modules/importers/textImporter";
import { languageDetector } from "../../../src/modules/tools/text/languageDetector";

export const Page = microAppFactory({
  importerLabel: "判定したいテキスト",
  outputLabel: "結果",
  importer: textImporter,
  analyzer: languageDetector,
});
