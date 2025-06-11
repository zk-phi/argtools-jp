import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { mojibakeSimulator } from "../../../src/modules/analyzers/text/mojibakeSimulator";

export const Page = microAppFactory({
  importerLabel: "復元したいテキスト",
  outputLabel: "復元結果",
  importer: stringImporter,
  analyzer: mojibakeSimulator,
});
