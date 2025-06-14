import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { morseDecoder } from "../../../src/modules/analyzers/text/morseDecoder";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "読み取りたい文字列" },
    { module: morseDecoder },
  ],
  outputLabel: "読み取り結果",
});
