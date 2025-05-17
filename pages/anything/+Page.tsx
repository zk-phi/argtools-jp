import { microAppFactory } from "../../src/microAppFactory";
import { wordlistImporter } from "../../src/modules/importers/wordlistImporter";
import { identity } from "../../src/modules/identity";

export const Page = microAppFactory({
  importerLabel: "データセットを選択",
  importer: wordlistImporter,
  analyzer: identity,
});
