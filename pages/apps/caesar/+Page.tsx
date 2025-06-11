import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { caesarDecoder } from "../../../src/modules/analyzers/text/caesarDecoder";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "復号化したいテキスト" },
    { module: caesarDecoder },
  ],
  outputLabel: "復号結果",
});
