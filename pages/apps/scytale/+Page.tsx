import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { scytaleDecoder } from "../../../src/modules/analyzers/text/scytaleDecoder";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "復号化したい文字列" },
    { module: scytaleDecoder },
  ],
  outputLabel: "復号化結果",
});
