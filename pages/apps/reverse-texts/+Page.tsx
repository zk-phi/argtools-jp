import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { reverseText } from "../../../src/modules/analyzers/text/reverseText";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "反転したい文字列" },
    { module: reverseText },
  ],
  outputLabel: "反転結果",
});
