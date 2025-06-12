import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { punycodeDecoder } from "../../../src/modules/analyzers/text/punycodeDecoder";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "読み取りたい Punycode" },
    { module: punycodeDecoder },
  ],
  outputLabel: "デコード結果",
});
