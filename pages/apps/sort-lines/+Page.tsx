import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { sortLines } from "../../../src/modules/analyzers/text/sortLines";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "並べ替えたい文字列" },
    { module: sortLines },
  ],
  outputLabel: "並べ替え結果",
});
