import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { caesarDecoder } from "../../../src/modules/analyzers/text/caesarDecoder";

export const Page = microAppFactory({
  importerLabel: "復号化したいテキスト",
  outputLabel: "復号結果",
  importer: stringImporter,
  analyzer: caesarDecoder,
});
