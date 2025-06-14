import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { mojibakeSimulator } from "../../../src/modules/analyzers/text/mojibakeSimulator";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "復元したい文字列" },
    { module: mojibakeSimulator },
  ],
  outputLabel: "復元結果",
});
