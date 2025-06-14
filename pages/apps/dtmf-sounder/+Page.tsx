import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { dtmfSounder } from "../../../src/modules/analyzers/text/dtmfSounder";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "ダイヤルしたい数字列" },
    { module: dtmfSounder },
  ],
  outputLabel: "再現されたダイヤル音",
});
