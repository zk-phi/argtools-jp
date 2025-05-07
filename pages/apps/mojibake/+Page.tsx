import { microAppFactory } from "../../../src/microAppFactory";
import { textImporter } from "../../../src/modules/importers/textImporter";
import { mojibakeSimulator } from "../../../src/modules/analyzers/text/mojibakeSimulator";

export const Page = microAppFactory({
  importerLabel: "復元したいテキスト",
  importer: textImporter,
  analyzer: mojibakeSimulator,
});
