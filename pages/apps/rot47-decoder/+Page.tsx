import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { rot47Decoder } from "../../../src/modules/analyzers/text/rot47Decoder";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "復号化したい文字列" },
    { module: rot47Decoder },
  ],
  outputLabel: "復号化結果",
});
