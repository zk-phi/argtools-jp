import { microAppFactory } from "../../../src/microAppFactory";
import { numberImporter } from "../../../src/modules/importers/numberImporter";
import { factorNumber } from "../../../src/modules/analyzers/number/factorNumber";

export const Page = microAppFactory({
  importerLabel: "解析したい数値",
  outputLabel: "解析結果",
  importer: numberImporter,
  analyzer: factorNumber,
});
