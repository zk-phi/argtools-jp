import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { pagerDecoder } from "../../../src/modules/analyzers/text/pagerDecoder";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "読み取りたい数字列" },
    { module: pagerDecoder },
  ],
  outputLabel: "読み取り結果",
});
