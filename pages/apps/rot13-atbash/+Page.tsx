import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { rot13Decoder } from "../../../src/modules/analyzers/text/rot13Decoder";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "復号化したい文字列" },
    { module: rot13Decoder },
  ],
  outputLabel: "復号化結果",
});
