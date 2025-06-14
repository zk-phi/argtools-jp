import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { base64Decoder } from "../../../src/modules/analyzers/text/base64Decoder";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "読み取りたい文字列" },
    { module: base64Decoder },
  ],
  outputLabel: "読み取り結果",
});
