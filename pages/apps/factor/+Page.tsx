import { microAppFactory } from "../../../src/microAppFactory";
import { numberImporter } from "../../../src/modules/importers/numberImporter";
import { factorNumber } from "../../../src/modules/analyzers/number/factorNumber";

export const Page = microAppFactory({
  pipeline: [
    { module: numberImporter, label: "解析したい数値" },
    { module: factorNumber },
  ],
  outputLabel: "解析結果",
});
