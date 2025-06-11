import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { languageDetector } from "../../../src/modules/tools/text/languageDetector";

export const Page = microAppFactory({
  importerLabel: "判定したいテキスト",
  outputLabel: "結果",
  importer: stringImporter,
  analyzer: languageDetector,
});
