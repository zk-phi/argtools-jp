import { microAppFactory } from "../../../src/microAppFactory";
import { textImporter } from "../../../src/modules/importers/textImporter";
import { characterCounter } from "../../../src/modules/tools/text/characterCounter";

export const Page = microAppFactory({
  importerLabel: "カウントしたいテキスト",
  outputLabel: "結果",
  importer: textImporter,
  analyzer: characterCounter,
});
