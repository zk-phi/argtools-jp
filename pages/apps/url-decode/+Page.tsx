import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { urlDecoder } from "../../../src/modules/analyzers/text/urlDecoder.ts";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "読み取りたい文字列" },
    { module: urlDecoder },
  ],
  outputLabel: "読み取り結果",
});
