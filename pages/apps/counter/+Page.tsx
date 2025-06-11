import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { characterCounter } from "../../../src/modules/tools/text/characterCounter";

export const Page = microAppFactory({
  importerLabel: "カウントしたいテキスト",
  outputLabel: "結果",
  importer: stringImporter,
  analyzer: characterCounter,
});
