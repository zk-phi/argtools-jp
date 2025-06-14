import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { escapedUnicodeDecoder } from "../../../src/modules/analyzers/text/escapedUnicodeDecoder";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "読み取りたい文字列" },
    { module: escapedUnicodeDecoder },
  ],
  outputLabel: "読み取り結果",
});
