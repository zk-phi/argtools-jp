import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { alterLines } from "../../../src/modules/analyzers/text/alterLines";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "改行したい文字列" },
    { module: alterLines },
  ],
  outputLabel: "改行されたテキスト",
});
