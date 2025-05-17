import { microAppFactory } from "../../../src/microAppFactory";
import { textImporter } from "../../../src/modules/importers/textImporter";
import { caesarDecoder } from "../../../src/modules/analyzers/text/caesarDecoder";

export const Page = microAppFactory({
  importerLabel: "復号化したいテキスト",
  outputLabel: "復号結果",
  importer: textImporter,
  analyzer: caesarDecoder,
});
