import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { languageDetector } from "../../../src/modules/tools/text/languageDetector";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "判定したいテキスト" },
    { module: languageDetector },
  ],
  outputLabel: "結果",
});
