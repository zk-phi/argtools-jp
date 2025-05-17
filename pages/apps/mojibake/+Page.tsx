import { microAppFactory } from "../../../src/microAppFactory";
import { textImporter } from "../../../src/modules/importers/textImporter";
import { mojibakeSimulator } from "../../../src/modules/analyzers/text/mojibakeSimulator";

export const Page = microAppFactory({
  importerLabel: "復元したいテキスト",
  outputLabel: "復元結果",
  importer: textImporter,
  analyzer: mojibakeSimulator,
});
